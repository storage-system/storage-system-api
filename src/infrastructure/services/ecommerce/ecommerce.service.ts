import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Company } from '@/domain/enterprise/company/company'
import { Slug } from '@/domain/enterprise/slug/slug'

import { PrismaEcommerceRepository } from './../../database/prisma/repositories/prisma-ecommerce-repository'
import { PublishEcommerceDTO } from './../../http/modules/ecommerce/dto/publish-ecommerce.dto'

@Injectable()
export class EcommerceService {
  constructor(
    private readonly ecommerceRepository: PrismaEcommerceRepository,
    private readonly companyRepository: CompaniesRepository,
  ) {}

  async publishEcommerce(data: PublishEcommerceDTO, companyId?: string) {
    const company = await this.retrieveCompany(companyId)

    const slug = Slug.createFromText(data.name)

    await this.verifyEcommerceExists(slug)

    const defaultStyle = {
      name: 'Default Theme',
      backgroundColor: '#f6f8fc',
      textColor: '#2f3652',
      primaryColor: '#6c63ff',
      secondaryColor: '#f1f5f9',
      tertiaryColor: '#ffffff',
      isActive: true,
    }

    const ecommerce = await this.ecommerceRepository.publishEcommerce({
      companyId: company.id.toString(),
      name: data.name,
      slug: slug.value,
      style: data.style
        ? {
            name: data.style.name,
            backgroundColor: data.style.backgroundColor,
            textColor: defaultStyle.textColor,
            primaryColor: defaultStyle.primaryColor,
            secondaryColor: defaultStyle.secondaryColor,
            tertiaryColor: defaultStyle.tertiaryColor,
          }
        : defaultStyle,
    })

    return {
      id: ecommerce.id,
    }
  }

  private async retrieveCompany(companyId?: string): Promise<Company> {
    if (!companyId) {
      throw new NotFoundException(`Company`, 'test')
    }

    const company = await this.companyRepository.findById(companyId)

    if (!company) {
      throw new NotFoundException(`Company`, companyId)
    }

    return company
  }

  private async verifyEcommerceExists(slug: Slug): Promise<null> {
    const ecommerce = await this.ecommerceRepository.findEcommerceBySlug(
      slug.value,
    )

    if (!ecommerce) {
      return null
    }

    throw new AlreadyExistsError(`Ecommerce`, slug.value)
  }

  async retrieveEcommerceBySlug(slug: string) {
    const ecommerce = await this.ecommerceRepository.findEcommerceBySlug(slug)

    if (!ecommerce) {
      throw new NotFoundException('Ecommerce not found', slug)
    }

    return ecommerce
  }

  async retrieveEcommerceByCompanyId(companyId?: string) {
    if (!companyId) {
      throw new NotFoundException('Company not found')
    }

    const ecommerce =
      await this.ecommerceRepository.findEcommerceByCompanyId(companyId)

    if (!ecommerce) {
      throw new NotFoundException(
        "This company doesn't have an ecommerce",
        companyId,
      )
    }

    return ecommerce
  }
}
