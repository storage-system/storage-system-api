
import { SubcategoriesRepository } from '../subcategories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'
import { CategoryPresenter } from '@/infrastructure/http/presenters/category-presenter'

interface FetchSubcategoriesUseCaseRequest {
  page: number
  perPage: number
}

type FetchSubcategoriesUseCaseResponse = PaginationProps<CategoryPresenter>

@Injectable()
export class FetchSubcategoriesUseCase {
  constructor(private subcategoriesRepository: SubcategoriesRepository) { }

  async execute({
    page,
    perPage,
  }: FetchSubcategoriesUseCaseRequest): Promise<FetchSubcategoriesUseCaseResponse> {
    const subcategories = await this.subcategoriesRepository.findAll({
      page,
      perPage,
    })

    return new Pagination({
      total: subcategories.total,
      items: subcategories.items,
      perPage: subcategories.perPage,
      page: subcategories.page,
    })
  }
}
