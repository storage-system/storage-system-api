import { EcommerceService } from '@/infrastructure/services/ecommerce/ecommerce.service'
import { Body, Controller, Injectable, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  @Post('/company/:companyId')
  async publishEcommerce(
    @Param('companyId') companyId: string,
    @Body() data: PublishEcommerceDTO,
  ) {
    return await this.ecommerceService.publishEcommerce(companyId, data)
  }
}
