import { UpdateProductStockUseCase } from '@/domain/application/product/use-cases/update-product-stock/update-product-stock-use-case'
import { GetProductUseCase } from '@/domain/application/product/use-cases/retrieve/get-product/get-product-use-case'
import { ListProductsUseCase } from '@/domain/application/product/use-cases/retrieve/list/list-products-use-case'
import { CreateProductUseCase } from '@/domain/application/product/use-cases/create/create-product-use-case'
import { DeleteProductUseCase } from '@/domain/application/product/use-cases/delete/delete-product-use-case'
import { UpdateProductUseCase } from '@/domain/application/product/use-cases/update/update-product-use-case'
import { SpreadsheetService } from '@/infrastructure/services/spreadsheet/spreadsheet.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { ProductController } from './product.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    UpdateProductStockUseCase,
    DeleteProductUseCase,
    SpreadsheetService,
  ],
})
export class ProductModule {}
