import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { CategoriesRepository } from "@/domain/application/category/categories-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository
    }
  ],
  exports: [
    PrismaService,
    CategoriesRepository
  ],
})
export class DatabaseModule { }