import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateCategoryController } from "./controllers/create-category.controller";
import { CreateCategoryUseCase } from "@/domain/application/category/use-cases/create-category";
import { FetchCategoriesUseCase } from "@/domain/application/category/use-cases/fetch-categories";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";
import { AuthenticateCompanyUseCase } from "@/domain/application/authenticate/authenticate-company";
import { CreateCompanyUseCase } from "@/domain/application/company/use-cases/create-company";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DeleteCategoryController } from "./controllers/delete-category.controller";
import { DeleteCategoryUseCase } from "@/domain/application/category/use-cases/delete-category";
@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    FetchCategoriesController,
    DeleteCategoryController,
  ],
  providers: [
    CreateCompanyUseCase,
    AuthenticateCompanyUseCase,
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    DeleteCategoryUseCase,
  ]
})
export class HttpModule { }