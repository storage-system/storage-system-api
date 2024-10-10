import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create/create-category-use-case";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { CurrentUser } from "@/infrastructure/decorators/current-user.decorator";
import { UserPayload } from "@/infrastructure/auth/jwt.strategy";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/retrieve/fetch-categories-use-case";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/update/edit-category-use-case";
import { EditCategoryDTO } from "./dto/edit-category.dto";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete/delete-category-use-case";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ParsePositiveIntPipe } from "../../pipes/parse-positive-int.pipe";
import { HttpCategoryListResponse } from "../../docs/category/http-category-list-response";

@ApiTags('Category')
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
    @Body() body: CreateCategoryDTO,
  ) {
    return await this.createCategoryUseCase.execute(body)
  }

  @Get()
  @ApiOkResponse({ type: HttpCategoryListResponse })
  async list(
    @Query('page', new ParsePositiveIntPipe(1)) page: number = 1,
    @Query('perPage', new ParsePositiveIntPipe(10)) perPage: number = 10,
  ) {
    return await this.fetchCategoriesUseCase.execute({
      page,
      perPage,
    })
  }

  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body() body: EditCategoryDTO,
    @CurrentUser() { companyId }: UserPayload,
    @Param('id') categoryId: string,
  ) {
    const { name, isActive } = body

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