import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";

@Module({
  providers: [PrismaService, PrismaCategoriesRepository],
  exports: [PrismaService, PrismaCategoriesRepository],
})
export class DatabaseModule { }