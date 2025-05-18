import { UpdateEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/update-ecommerce-products/update-ecommerce-products-use-case'
import { ListEcommerceProductsCommand } from '@/domain/application/ecommerce/use-case/retrieve/list/list-ecommerce-products-command'
import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import { ListEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/retrieve/list/list-products-use-case'
import {
  CurrentUser,
  UserPayload,
} from '@/infrastructure/decorators/current-user.decorator'
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { Public } from '@/infrastructure/auth/public'
import { User } from '@/domain/enterprise/user/user'
import { ApiQuery, ApiTags } from '@nestjs/swagger'

import { ParsePositiveIntPipe } from '../../pipes/parse-positive-int.pipe'
import { UpdateEcommerceProductsDTO } from './dto/update-products.dto'
import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly publishEcommerceUseCase: PublishEcommerceUseCase,
    private readonly updateProductsUseCase: UpdateEcommerceProductsUseCase,
    private readonly listProductsUseCase: ListEcommerceProductsUseCase,
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

  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'perPage',
    type: Number,
    required: false,
    description: 'Number of items per page',
  })
  @Public()
  @Get('/:slug')
  async listProducts(
    @Param('slug') slug: string,
    @Query('page', new ParsePositiveIntPipe(1)) page: number = 1,
    @Query('perPage', new ParsePositiveIntPipe(10)) perPage: number = 10,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.listProductsUseCase.execute(
      ListEcommerceProductsCommand.create({
        page,
        perPage,
        ecommerceSlug: slug,
        categoryId,
      }),
    )
  }
}
