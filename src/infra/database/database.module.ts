import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { CategoriesRepository } from "@/domain/application/category/categories-repository";
import { CompaniesRepository } from "@/domain/application/company/companies-repository";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";

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
    }
  ],
  exports: [
    PrismaService,
    CategoriesRepository,
    CompaniesRepository,
  ],
})
export class DatabaseModule { }