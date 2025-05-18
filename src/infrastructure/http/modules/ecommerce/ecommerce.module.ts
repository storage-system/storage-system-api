import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { EcommerceController } from './ecommerce.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [EcommerceController],
  providers: [PublishEcommerceUseCase],
})
export class EcommerceModule {}
