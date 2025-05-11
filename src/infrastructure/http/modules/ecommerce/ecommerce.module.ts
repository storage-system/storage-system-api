import { EcommerceModule as EcommerceServiceModule } from '@/infrastructure/services/ecommerce/ecommerce.module'
import { Module } from '@nestjs/common'

import { EcommerceController } from './ecommerce.controller'

@Module({
  imports: [EcommerceServiceModule],
  controllers: [EcommerceController],
})
export class EcommerceModule {}
