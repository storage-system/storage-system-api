import { GetEcommerceByCompanyIdUseCase } from '@/domain/application/ecommerce/use-case/retrieve/get-by-company-id/get-ecommerce-by-company-id-use-case'
import { UpdateEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/update-ecommerce-products/update-ecommerce-products-use-case'
import { ListEcommerceProductsCommand } from '@/domain/application/ecommerce/use-case/retrieve/list-products/list-ecommerce-products-command'
import { GetEcommerceBySlugUseCase } from '@/domain/application/ecommerce/use-case/retrieve/get-by-slug/get-ecommerce-by-slug-use-case'
import { ListEcommerceProductsUseCase } from '@/domain/application/ecommerce/use-case/retrieve/list-products/list-products-use-case'
import { PublishEcommerceUseCase } from '@/domain/application/ecommerce/use-case/publish-ecommerce/publish-ecommerce-use-case'
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '@/infrastructure/auth/public'
import { User } from '@/domain/enterprise/user/user'

import { ParsePositiveIntPipe } from '../../pipes/parse-positive-int.pipe'
import { UpdateEcommerceProductsDTO } from './dto/update-products.dto'
import { RetrieveEcommerceDTO } from './dto/retrieve-ecommerce.dto'
import { PublishEcommerceDTO } from './dto/publish-ecommerce.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly publishEcommerceUseCase: PublishEcommerceUseCase,
    private readonly updateProductsUseCase: UpdateEcommerceProductsUseCase,
    private readonly listProductsUseCase: ListEcommerceProductsUseCase,
    private readonly getEcommerceBySlugUseCase: GetEcommerceBySlugUseCase,
    private readonly getEcommerceyCompanyIdUseCase: GetEcommerceByCompanyIdUseCase,
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

  @Public()
  @Get('/:slug')
  async retrieveEcommerce(@Param('slug') slug: string) {
    return this.getEcommerceBySlugUseCase.execute({ slug })
  }

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Ecommerce retrieved successfully',
    type: RetrieveEcommerceDTO,
  })
  async retrieveEcommerceByCompanyId(
    @CurrentUser(CurrentUserPipe) author: User,
  ) {
    return this.getEcommerceyCompanyIdUseCase.execute({
      companyId: author.companyId!.toString(),
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
  @Get('/:slug/products')
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
