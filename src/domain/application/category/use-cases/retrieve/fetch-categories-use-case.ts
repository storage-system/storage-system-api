import { Category } from '@/domain/enterprise/category/category'
import { CategoriesRepository } from '../../categories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchCategoriesUseCaseRequest {
  page: number
  perPage: number
}

type FetchCategoriesUseCaseResponse = Either<null, PaginationProps<Category>>

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

    return right(
      new Pagination({
        total: categories.total,
        items: categories.items,
        perPage: categories.perPage,
        page: categories.page,
      })
    )
  }
}
