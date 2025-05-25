import { CategoryPresenter } from '@/infrastructure/http/presenters/category-presenter'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Pagination } from '@/core/entities/pagination'

import { CategoriesRepository } from '../../../../../enterprise/category/categories-repository'

interface ListCategoriesUseCaseRequest {
  ecommerceSlug: string
}

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly companyRepository: CompaniesRepository,
  ) {}

  async execute({ ecommerceSlug }: ListCategoriesUseCaseRequest) {
    const company = await this.findCompanyByEcommerceSlug(ecommerceSlug)

    if (!company.id) {
      throw new NotFoundException('Company not found')
    }

    const categories = await this.categoriesRepository.findAllByCompanyId(
      company.id.toString(),
    )

    return categories.map((item) => CategoryPresenter.toHTTP(item))
  }

  private async findCompanyByEcommerceSlug(slug: string) {
    const company = await this.companyRepository.findByEcommerceSlug(slug)

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    return company
  }
}
