import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { CreateProductUseCase } from "@/domain/application/product/use-cases/create/create-product-use-case";
import { ListProductsUseCase } from "@/domain/application/product/use-cases/retrieve/list/list-products-use-case";
import { GetProductUseCase } from "@/domain/application/product/use-cases/retrieve/get-product/get-product-use-case";
import { DeleteProductUseCase } from "@/domain/application/product/use-cases/delete/delete-product-use-case";

@Module({
  imports: [DatabaseModule],
  controllers: [
    ProductController,
  ],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    DeleteProductUseCase,
  ]
})
export class ProductModule { }