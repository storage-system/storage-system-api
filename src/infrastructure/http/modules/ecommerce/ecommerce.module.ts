import { EcommerceModule as EcommerceServiceModule } from '@/infrastructure/services/ecommerce/ecommerce.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { EcommerceController } from './ecommerce.controller'

@Module({
  imports: [EcommerceServiceModule, DatabaseModule],
  controllers: [EcommerceController],
})
export class EcommerceModule {}
