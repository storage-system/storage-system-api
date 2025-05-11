import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { EcommerceService } from './ecommerce.service'

@Module({
  imports: [DatabaseModule],
  providers: [EcommerceService],
  exports: [EcommerceService],
})
export class EcommerceModule {}
