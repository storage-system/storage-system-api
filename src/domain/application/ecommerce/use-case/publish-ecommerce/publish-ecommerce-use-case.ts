import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import NotAuthorizedException from '@/core/exception/not-authorized-exception'
import NotificationException from '@/core/exception/notification-exception'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/enterprise/company/company'
import { Notification } from '@/core/validation/notification'
import { Style } from '@/domain/enterprise/style/style'
import { User } from '@/domain/enterprise/user/user'
import { Slug } from '@/domain/enterprise/slug/slug'
import { Injectable, Logger } from '@nestjs/common'
import { log } from 'console'

export interface PublishEcommerceUseCaseRequest {
  name: string
  companyId: string
  author: User
  
  style?: {
    name: string
    isActive: boolean
    backgroundColor: string
    textColor: string
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
  }
}

@Injectable()
export class PublishEcommerceUseCase {
  notification: Notification
  logger: Logger = new Logger(PublishEcommerceUseCase.name)

  constructor(
    private readonly ecommerceRepository: EcommerceRepository,
    private readonly companyRepository: CompaniesRepository,
  ) {}

  async execute(props: PublishEcommerceUseCaseRequest) {
    const company = await this.findCompanyById(props.companyId)
    await this.verifyIfCompanyAlreadyHasEcommerce(company)
    this.verifyIfRequestAuthorIsCompanyOwner(props.author, company)
    const slug = await this.createEcommerceSlug(props.name)

    const ecommerce = await this.createEcommerce({
      name: props.name,
      slug,
      style: props.style,
      companyId: company.id,
    })

    return { id: ecommerce.id.toString(), slug: ecommerce.slug.value }
  }

  private async findCompanyById(companyId: string) {
    this.notification = Notification.create()
    const company = await this.companyRepository.findById(companyId)

    if (!company) {
      throw new ResourceNotFoundError()
    }

    return company
  }

  private verifyIfRequestAuthorIsCompanyOwner(author: User, company: Company) {
    this.logger.debug('=>', author, company)
    if (author.id.toString() !== company.responsibleId) {
      throw new NotAuthorizedException(
        'You are not authorized to perform this action',
        this.notification,
      )
    }
  }

  private async verifyIfCompanyAlreadyHasEcommerce(company: Company) {
    const ecommerce = await this.ecommerceRepository.findByCompanyId(
      company.id.toString(),
    )

    if (ecommerce) {
      throw new NotificationException(
        `Company ${company.id.toString()} already has an ecommerce`,
        this.notification,
      )
    }
  }

  private async createEcommerceSlug(name: string) {
    let slug = Slug.createFromText(name)
    let ecommerce = await this.ecommerceRepository.findBySlug(slug)

    if (ecommerce) {
      const uuid = crypto.randomUUID().split('-')[0]
      slug = Slug.createFromText(`${name}-${uuid}`)
      ecommerce = await this.ecommerceRepository.findBySlug(slug)

      if (ecommerce) {
        this.notification.appendAnError({
          message: `Ecommerce with slug ${{ slug }} already exists, even after appending a unique identifier`,
        })
      }
    }

    return slug
  }

  private async createEcommerce({
    name,
    slug,
    style,
    companyId,
  }: {
    name: string
    style?: PublishEcommerceUseCaseRequest['style']
    companyId: UniqueEntityID
    slug: Slug
  }) {
    const ecommerceId = new UniqueEntityID()

    const defaultStyle = {
      name: 'default',
      isActive: true,
      backgroundColor: '#f9f7ff',
      textColor: '#3c4766',
      primaryColor: '#4c6ef5',
      secondaryColor: '#f1f5f9',
      tertiaryColor: '#ffffff',
    }

    const ecommerceStyle = Style.create({
      ecommerceId,
      name: style?.name ?? defaultStyle.name,
      textColor: style?.textColor ?? defaultStyle.textColor,
      backgroundColor: style?.backgroundColor ?? defaultStyle.backgroundColor,
      isActive: style?.isActive ?? defaultStyle.isActive,
      primaryColor: style?.primaryColor ?? defaultStyle.primaryColor,
      secondaryColor: style?.secondaryColor ?? defaultStyle.secondaryColor,
      tertiaryColor: style?.tertiaryColor ?? defaultStyle.tertiaryColor,
    })

    const ecommerce = Ecommerce.create(
      {
        name,
        slug,
        isActive: true,
        companyId,
        styles: [ecommerceStyle],
      },
      ecommerceId,
    )

    await this.ecommerceRepository.save(ecommerce)

    return ecommerce
  }
}
