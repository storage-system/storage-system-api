import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ListCategoriesUseCase } from '@/domain/application/category/use-cases/retrieve/list-categories-use-case'
import { CreateCategoryUseCase } from '@/domain/application/category/use-cases/create/create-category-use-case'
import { DeleteCategoryUseCase } from '@/domain/application/category/use-cases/delete/delete-category-use-case'
import { UpdateCategoryUseCase } from '@/domain/application/category/use-cases/update/update-category-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User } from '@/domain/enterprise/user/user'

import { HttpCategoryListResponse } from '../../docs/category/http-category-list-response'
import { ParsePositiveIntPipe } from '../../pipes/parse-positive-int.pipe'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'

@ApiTags('Category')
@Controller('/categories')
export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoriesUseCase: ListCategoriesUseCase,
    private editCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateCategoryDTO, @CurrentUser() author: User) {
    return await this.createCategoryUseCase.execute({ ...body, author })
  }

  @Get()
  @ApiOkResponse({ type: HttpCategoryListResponse })
  async list(
    @Query('page', new ParsePositiveIntPipe(1)) page: number = 1,
    @Query('perPage', new ParsePositiveIntPipe(10)) perPage: number = 10,
  ) {
    return await this.listCategoriesUseCase.execute({
      page,
      perPage,
    })
  }

  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body() body: UpdateCategoryDTO,
    @Param('id') categoryId: string,
  ) {
    const { name, isActive, companyId } = body

    return await this.editCategoryUseCase.execute({
      name,
      isActive,
      categoryId,
      companyId,
    })
  }

  @Delete('/:id')
  async delete(@Param('id') categoryId: string) {
    return await this.deleteCategoryUseCase.execute({
      categoryId,
    })
  }
}
