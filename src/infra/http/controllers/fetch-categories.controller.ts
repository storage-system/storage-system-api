import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchCategoriesUseCase } from '@/domain/application/category/use-cases/fetch-categories'
import { Pagination } from '@/core/entities/pagination'
import { CategoryPresenter } from '../presenters/category-presenter'
import { z } from 'zod'

const fetchCategoriesParamsSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10)
})

const paramsValidationPìpe = new ZodValidationPipe(fetchCategoriesParamsSchema)

type FetchCategoriesQuerySchema = z.infer<typeof fetchCategoriesParamsSchema>

@Controller('/categories')
@UseGuards(JwtAuthGuard)
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
      throw new Error()
    }

    const { total, items } = result.value;

    return new Pagination({
      page,
      perPage,
      total,
      items: items?.map(CategoryPresenter.toHTTP)
    })
  }
}