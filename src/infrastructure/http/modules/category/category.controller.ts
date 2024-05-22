import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create/create-category-use-case";
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateCategoryBodySchema, bodyValidationPipe } from "./dto/create-category.dto";
import { CurrentCompany } from "@/infrastructure/auth/current-company-decorator";
import { CompanyPayload } from "@/infrastructure/auth/jwt.strategy";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/retrieve/fetch-categories-use-case";
import { FetchCategoriesQuerySchema, fetchCategoriesParamsSchema, paramsValidationPìpe } from "./dto/fetch-categories.dto";
import { Pagination } from "@/core/entities/pagination";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/update/edit-category-use-case";
import { EditCategoryBodySchema } from "./dto/edit-category.dto";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete/delete-category-use-case";

@Controller('/categories')
export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private fetchCategoriesUseCase: FetchCategoriesUseCase,
    private editCategoryUseCase: EditCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
  ) { }

  @Post()
  async create(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload
  ) {
    const { name, isActive } = body

    const companyId = company.sub

    return await this.createCategoryUseCase.execute({
      name,
      isActive,
      companyId,
    })
  }

  @Get()
  async list(
    @Query(paramsValidationPìpe) query: FetchCategoriesQuerySchema,
  ) {
    const { page, perPage } = query

    return await this.fetchCategoriesUseCase.execute({
      page,
      perPage
    })
  }

  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload,
    @Param('id') categoryId: string,
  ) {
    const { name, isActive } = body
    const companyId = company.sub

    return await this.editCategoryUseCase.execute({
      name,
      isActive,
      categoryId,
      companyId,
    })
  }

  @Delete('/:id')
  async delete(
    @Param('id') categoryId: string,
  ) {
    return await this.deleteCategoryUseCase.execute({
      categoryId,
    })
  }
}