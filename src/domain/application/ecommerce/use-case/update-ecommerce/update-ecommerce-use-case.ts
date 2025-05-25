import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import NotAuthorizedException from '@/core/exception/not-authorized-exception'
import NotificationException from '@/core/exception/notification-exception'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { Notification } from '@/core/validation/notification'
import { Hero } from '@/domain/enterprise/ecommerce/hero'
import { Style } from '@/domain/enterprise/style/style'
import { User } from '@/domain/enterprise/user/user'
import { Slug } from '@/domain/enterprise/slug/slug'
import { Injectable, Logger } from '@nestjs/common'

export interface UpdateEcommerceUseCaseRequest {
  companyId: string
  name?: string
  ecommercePreview: string
  author: User
  hero?: {
    fileId: string
    text: string
  }[]
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
export class UpdateEcommerceUseCase {
  private notification: Notification
  private logger = new Logger(UpdateEcommerceUseCase.name)

  constructor(
    private readonly ecommerceRepository: EcommerceRepository,
    private readonly companyRepository: CompaniesRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(props: UpdateEcommerceUseCaseRequest) {
    this.notification = Notification.create()

    const ecommerce = await this.ecommerceRepository.findByCompanyId(
      props.companyId,
    )
    if (!ecommerce) throw new ResourceNotFoundError()

    const company = await this.companyRepository.findById(
      ecommerce.companyId.toString(),
    )
    if (!company) throw new ResourceNotFoundError()

    this.verifyIfRequestAuthorIsCompanyOwner(props.author, company)

    const previewFile = await this.verifyIfPreviewFileExists(
      props.ecommercePreview,
    )

    const partialUpdate: {
      name?: string
      slug?: Slug
      ecommercePreview: typeof previewFile.id
      hero?: Hero[]
      styles?: Style[]
    } = {
      ecommercePreview: previewFile.id,
    }

    if (props.name && props.name !== ecommerce.name) {
      const newSlug = await this.createEcommerceSlug(
        props.name,
        ecommerce.id.toString(),
      )
      partialUpdate.name = props.name
      partialUpdate.slug = newSlug
    }

    if (props.hero) {
      partialUpdate.hero = await this.createHero(props.hero)
    }

    if (props.style) {
      const newStyle = Style.create({
        ecommerceId: ecommerce.id,
        name: props.style.name,
        isActive: props.style.isActive,
        backgroundColor: props.style.backgroundColor,
        textColor: props.style.textColor,
        primaryColor: props.style.primaryColor,
        secondaryColor: props.style.secondaryColor,
        tertiaryColor: props.style.tertiaryColor,
      })

      partialUpdate.styles = [newStyle]
    }

    ecommerce.update(partialUpdate)

    await this.ecommerceRepository.update(ecommerce)

    return {
      id: ecommerce.id.toString(),
      slug: ecommerce.slug.value,
    }
  }

  private verifyIfRequestAuthorIsCompanyOwner(
    author: User,
    company: Awaited<ReturnType<CompaniesRepository['findById']>>,
  ) {
    if (author.id.toString() !== company?.responsibleId) {
      throw new NotAuthorizedException(
        'You are not authorized to perform this action',
        this.notification,
      )
    }
  }

  private async createEcommerceSlug(name: string, ecommerceId: string) {
    let slug = Slug.createFromText(name)
    const existing = await this.ecommerceRepository.findBySlug(slug)

    if (existing && existing.id.toString() !== ecommerceId) {
      const uuid = crypto.randomUUID().split('-')[0]
      slug = Slug.createFromText(`${name}-${uuid}`)
    }

    return slug
  }

  private async verifyIfPreviewFileExists(fileId: string) {
    const file = await this.fileRepository.findById(fileId)
    if (!file) {
      throw new NotificationException(
        'Preview file not found',
        this.notification,
      )
    }
    return file
  }

  private async createHero(hero: UpdateEcommerceUseCaseRequest['hero']) {
    const heroList: Hero[] = []

    for (const item of hero ?? []) {
      const file = await this.fileRepository.findById(item.fileId)

      if (!file) {
        this.notification.appendAnError({
          message: `File with id ${item.fileId} not found`,
        })
      } else {
        const heroItem = Hero.create({
          fileId: file.id,
          text: item.text,
        })
        heroList.push(heroItem)
      }
    }

    if (this.notification.hasErrors()) {
      throw new NotificationException(
        'Error updating ecommerce hero',
        this.notification,
      )
    }

    return heroList
  }
}
