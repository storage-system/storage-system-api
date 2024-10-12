import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { GetProductUseCase } from '@/domain/application/product/use-cases/retrieve/get-product/get-product-use-case'
import { ListProductsUseCase } from '@/domain/application/product/use-cases/retrieve/list/list-products-use-case'
import { CreateProductUseCase } from '@/domain/application/product/use-cases/create/create-product-use-case'
import { DeleteProductUseCase } from '@/domain/application/product/use-cases/delete/delete-product-use-case'
import { UpdateProductUseCase } from '@/domain/application/product/use-cases/update/update-product-use-case'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { HttpProductListResponse } from '../../docs/product/http-product-list-response'
import { HttpProductGetResponse } from '../../docs/product/htt-product-get-response'
import { QueryParamsDTO } from '../query-params/query-params.dto'
import { CreateProductDTO } from './dto/create-product-dto'
import { UpdateProductDTO } from './dto/update-product-dto'

@ApiTags('Product')
@Controller('/products')
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProductDTO) {
    return await this.createProductUseCase.execute(body)
  }

  @Get('/company/:companyId')
  @ApiOkResponse({ type: HttpProductListResponse })
  async list(
    @Query() query: QueryParamsDTO,
    @Param('companyId') companyId: string,
  ) {
    return await this.listProductsUseCase.execute({
      ...query,
      companyId,
    })
  }

  @Get('/:id')
  @ApiOkResponse({ type: HttpProductGetResponse })
  async getById(@Param('id') productId: string) {
    return await this.getProductUseCase.execute({
      productId,
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateProductDTO, @Param('id') productId: string) {
    return await this.updateProductUseCase.execute({
      productId,
      ...body,
    })
  }

  @Delete('/:id')
  async delete(@Param('id') productId: string) {
    return await this.deleteProductUseCase.execute({
      productId,
    })
  }
}
