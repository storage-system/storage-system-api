import { ListCategoriesUseCase } from '@/domain/application/category/use-cases/retrieve/list-categories-use-case'
import { CreateCategoryUseCase } from '@/domain/application/category/use-cases/create/create-category-use-case'
import { DeleteCategoryUseCase } from '@/domain/application/category/use-cases/delete/delete-category-use-case'
import { UpdateCategoryUseCase } from '@/domain/application/category/use-cases/update/update-category-use-case'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { CategoryController } from './category.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase,
    UpdateCategoryUseCase,
  ],
})
export class CategoryModule {}
