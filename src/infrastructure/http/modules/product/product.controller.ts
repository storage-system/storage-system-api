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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { UpdateProductStockUseCase } from '@/domain/application/product/use-cases/update-product-stock/update-product-stock-use-case'
import { GetProductUseCase } from '@/domain/application/product/use-cases/retrieve/get-product/get-product-use-case'
import { ListProductsUseCase } from '@/domain/application/product/use-cases/retrieve/list/list-products-use-case'
import { CreateProductUseCase } from '@/domain/application/product/use-cases/create/create-product-use-case'
import { DeleteProductUseCase } from '@/domain/application/product/use-cases/delete/delete-product-use-case'
import { UpdateProductUseCase } from '@/domain/application/product/use-cases/update/update-product-use-case'
import { SpreadsheetService } from '@/infrastructure/services/spreadsheet/spreadsheet.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { HttpProductListResponse } from '../../docs/product/http-product-list-response'
import { HttpProductGetResponse } from '../../docs/product/htt-product-get-response'
import { UpdateProductStockDTO } from './dto/update-product-stock.dto'
import { QueryParamsDTO } from '../query-params/query-params.dto'
import { CreateProductDTO } from './dto/create-product-dto'
import { UpdateProductDTO } from './dto/update-product-dto'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { User } from '@/domain/enterprise/user/user'

@ApiTags('Product')
@Controller('/products')
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private updateProductStockUseCase: UpdateProductStockUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private spreadsheetService: SpreadsheetService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProductDTO, @CurrentUser() author: User) {
    return await this.createProductUseCase.execute({...body, author})
  }

  /* @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(
    @UploadedFile() file: Express.Multer.File,
    @Body('companyId') companyId: string,
  ) {
    return this.productService.importProductsFromExcel(file, companyId)
  } */

  @Get('/template')
  async downloadTemplate(@Res() res: Response) {
    return this.spreadsheetService.generateExcelProductTemplate(res)
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

  @Patch('/:id/update-stock')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStock(
    @Body() body: UpdateProductStockDTO,
    @Param('id') productId: string,
  ) {
    return await this.updateProductStockUseCase.execute({
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
