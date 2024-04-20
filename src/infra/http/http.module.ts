import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateCategoryController } from "./controllers/create-category.controller";
import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create-category";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/fetch-categories";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    FetchCategoriesController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
  ]
})
export class HttpModule { }