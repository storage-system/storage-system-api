import { Module } from "@nestjs/common";
import { CreateCategoryController } from "./create-category.controller";
import { DeleteCategoryController } from "./delete-category.controller";
import { FetchCategoriesController } from "./fetch-categories.controller";
import { EditCategoryController } from "./edit-category.controller";
import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create-category";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/fetch-categories";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete-category";
import { EditCategoryUseCase } from "@/domain/application/category/use-cases/edit-category";
import { DatabaseModule } from "@/infra/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FetchCategoriesController,
    DeleteCategoryController,
    EditCategoryController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    DeleteCategoryUseCase,
    EditCategoryUseCase,
  ]
})
export class CategoryModule { }