import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create/create-category-use-case";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/retrieve/fetch-categories-use-case";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete/delete-category-use-case";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/update/edit-category-use-case";
import { DatabaseModule } from "@/infrastructure/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CategoryController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    DeleteCategoryUseCase,
    EditCategoryUseCase,
  ]
})
export class CategoryModule { }