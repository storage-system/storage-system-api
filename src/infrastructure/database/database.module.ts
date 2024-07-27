import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { CategoriesRepository } from "@/domain/application/category/categories-repository";
import { CompaniesRepository } from "@/domain/application/company/companies-repository";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { UsersRepository } from "@/domain/application/user/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ProductsRepository } from "@/domain/application/product/products-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    }
  ],
  exports: [
    PrismaService,
    CategoriesRepository,
    CompaniesRepository,
    UsersRepository,
    ProductsRepository,
  ],
})
export class DatabaseModule { }