import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create-category";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/fetch-categories";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete-category";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/edit-category";
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