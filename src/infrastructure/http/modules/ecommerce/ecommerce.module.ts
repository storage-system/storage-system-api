import { UpdateEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/update-ecommerce-products/update-ecommerce-products-use-case'
import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import { ListEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/retrieve/list/list-products-use-case'
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
  ],
})
export class EcommerceModule {}
