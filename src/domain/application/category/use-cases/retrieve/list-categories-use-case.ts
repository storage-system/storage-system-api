import { CategoryPresenter } from '@/infrastructure/http/presenters/category-presenter'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'

interface ListCategoriesUseCaseRequest {
  page: number
  perPage: number
}

type ListCategoriesUseCaseResponse = PaginationProps<CategoryPresenter>

@Injectable()
export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    page,
    perPage,
  }: ListCategoriesUseCaseRequest): Promise<ListCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findAll({
      page,
      perPage,
    })

    return new Pagination({
      total: categories.total,
      items: categories.items.map(CategoryPresenter.toHTTP),
      perPage: categories.perPage,
      page: categories.page,
    })
  }
}
