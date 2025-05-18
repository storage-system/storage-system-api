import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import {
  CurrentUser,
  UserPayload,
} from '@/infrastructure/decorators/current-user.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { User } from '@/domain/enterprise/user/user'
import { ApiTags } from '@nestjs/swagger'

import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly publishEcommerceUseCase: PublishEcommerceUseCase,
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
}
