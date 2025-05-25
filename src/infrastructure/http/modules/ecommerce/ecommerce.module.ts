import { GetEcommerceByCompanyIdUseCase } from '@/domain/application/ecommerce/use-case/retrieve/get-by-company-id/get-ecommerce-by-company-id-use-case'
import { UpdateEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/update-ecommerce-products/update-ecommerce-products-use-case'
import { ListCategoriesUseCase } from '@/domain/application/ecommerce/use-case/retrieve/list-ecommerce-categories/list-categories-use-case'
import { GetEcommerceBySlugUseCase } from '@/domain/application/ecommerce/use-case/retrieve/get-by-slug/get-ecommerce-by-slug-use-case'
import { ListEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/retrieve/list-products/list-products-use-case'
import { GetProductUseCase } from '@/domain/application/ecommerce/use-case/retrieve/get-product-by-id/get-product-by-id-use-case'
import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import { UpdateEcommerceUseCase } from '@/domain/application/ecommerce/use-case/update-ecommerce/update-ecommerce-use-case'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { EcommerceController } from './ecommerce.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [EcommerceController],
  providers: [
    PublishEcommerceUseCase,
    UpdateEcommerceProductsUseCase,
    ListEcommerceProductsUseCase,
    GetEcommerceBySlugUseCase,
    GetEcommerceByCompanyIdUseCase,
    ListCategoriesUseCase,
    GetProductUseCase,
    UpdateEcommerceUseCase,
  ],
})
export class EcommerceModule {}
