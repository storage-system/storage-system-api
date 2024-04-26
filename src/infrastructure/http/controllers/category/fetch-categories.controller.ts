import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchCategoriesUseCase } from '@/domain/application/category/use-cases/fetch-categories'
import { Pagination } from '@/core/entities/pagination'
import { CategoryPresenter } from '../../presenters/category-presenter'
import { FetchCategoriesQuerySchema, fetchCategoriesParamsSchema, paramsValidationPìpe } from './dto/fetch-categories.dto'

@Controller('/categories')
export class FetchCategoriesController {
  constructor(private fetchCategories: FetchCategoriesUseCase) { }

  @Get()
  async handle(
    @Query(paramsValidationPìpe) query: FetchCategoriesQuerySchema,
  ) {
    const { page, perPage } = fetchCategoriesParamsSchema.parse(query)

    const result = await this.fetchCategories.execute({
      page,
      perPage
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return new Pagination({
      ...result.value,
      items: result.value.items?.map(CategoryPresenter.toHTTP)
    })
  }
}