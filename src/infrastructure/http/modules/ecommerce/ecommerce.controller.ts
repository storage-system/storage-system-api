import { UpdateEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/update-products-to-ecommerce-use-case'
import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import {
  CurrentUser,
  UserPayload,
} from '@/infrastructure/decorators/current-user.decorator'
import { Body, Controller, Patch, Post } from '@nestjs/common'
import { User } from '@/domain/enterprise/user/user'
import { ApiTags } from '@nestjs/swagger'

import { UpdateEcommerceProductsDTO } from './dto/update-products.dto'
import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly publishEcommerceUseCase: PublishEcommerceUseCase,
    private readonly updateProductsUseCase: UpdateEcommerceProductsUseCase,
  ) {}

  @Post('/publish')
  async publishEcommerce(
    @CurrentUser(CurrentUserPipe) author: User,
    @Body() body: PublishEcommerceDTO,
  ) {
    return this.publishEcommerceUseCase.execute({
      author,
      companyId: author.companyId?.toString()!,
      ...body,
    })
  }

  @Patch('/update-products')
  async updateProducts(
    @CurrentUser(CurrentUserPipe) author: User,
    @Body() body: UpdateEcommerceProductsDTO,
  ) {
    return this.updateProductsUseCase.execute({
      author,
      products: body,
    })
  }
}
