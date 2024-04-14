import { Category } from '@/domain/enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'

interface FetchCategoriesUseCaseRequest {
  page: number
  perPage: number
}

export type FetchCategoriesUseCaseResponse = PaginationProps<Category>

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
      items: categories.items,
      perPage: categories.perPage,
      page: categories.page,
    })
  }
}
