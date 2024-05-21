
import { CategoriesRepository } from '../../categories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'
import { CategoryPresenter } from '@/infrastructure/http/presenters/category-presenter'

interface FetchCategoriesUseCaseRequest {
  page: number
  perPage: number
}

type FetchCategoriesUseCaseResponse = PaginationProps<CategoryPresenter>

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    page,
    perPage,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
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
