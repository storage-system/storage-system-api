import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateCategoryController } from "./controllers/create-category.controller";

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController
  ],
  providers: [
    PrismaService,
  ]
})
export class HttpModule { }