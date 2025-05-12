import {
  CurrentUser,
  UserPayload,
} from '@/infrastructure/decorators/current-user.decorator'
import { EcommerceService } from '@/infrastructure/services/ecommerce/ecommerce.service'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { RetrieveEcommerceByCompanyIdDTO } from './dto/retrieve-ecommerce-by-company.dto'
import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  @Post()
  async publishEcommerce(
    @Body() data: PublishEcommerceDTO,
    @CurrentUser(CurrentUserPipe) user: UserPayload,
  ) {
    return await this.ecommerceService.publishEcommerce(data, user.companyId)
  }

  @ApiResponse({
    type: RetrieveEcommerceByCompanyIdDTO,
    status: 200,
    description: 'Ecommerce retrieved successfully',
  })
  @Get()
  async getEcommerce(@CurrentUser(CurrentUserPipe) user: UserPayload) {
    return await this.ecommerceService.retrieveEcommerceByCompanyId(
      user.companyId,
    )
  }
}
