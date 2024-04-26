import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create-category";
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, MethodNotAllowedException, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateCategoryBodySchema, bodyValidationPipe } from "./dto/create-category.dto";
import { CurrentCompany } from "@/infrastructure/auth/current-company-decorator";
import { CompanyPayload } from "@/infrastructure/auth/jwt.strategy";
import { CategoryAlreadyExistsError } from "@/core/errors/category-already-exists-error";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/fetch-categories";
import { FetchCategoriesQuerySchema, fetchCategoriesParamsSchema, paramsValidationPìpe } from "./dto/fetch-categories.dto";
import { Pagination } from "@/core/entities/pagination";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/edit-category";
import { EditCategoryBodySchema } from "./dto/edit-category.dto";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete-category";

@Controller('/categories')
export class CategoryController{
  constructor(
    private createCategory: CreateCategoryUseCase,
    private fetchCategories: FetchCategoriesUseCase,
    private editCategory: EditCategoryUseCase,
    private deleteCategory: DeleteCategoryUseCase,
  ) { }

  @Post()
  async create(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload
  ) {
    const { name, isActive } = body

    const companyId = company.sub

    if (!companyId) {
      throw new NotFoundException('Company not found');
    }

    const result = await this.createCategory.execute({
      name,
      isActive,
      companyId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CategoryAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

  @Get()
  async list(
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

  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload,
    @Param('id') categoryId: string,
  ) {
    const { name, isActive } = body
    const companyId = company.sub

    const result = await this.editCategory.execute({
      name,
      isActive,
      categoryId,
      companyId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') categoryId: string,
  ) {
    const result = await this.deleteCategory.execute({
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}