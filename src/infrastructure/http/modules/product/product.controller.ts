import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { CreateProductDTO } from "./dto/create-product-dto";
import { CreateProductUseCase } from "@/domain/application/product/use-cases/create/create-product-use-case";
import { DeleteProductUseCase } from "@/domain/application/product/use-cases/delete/delete-product-use-case";
import { ListProductsUseCase } from "@/domain/application/product/use-cases/retrieve/list/list-products-use-case";
import { GetProductUseCase } from "@/domain/application/product/use-cases/retrieve/get-product/get-product-use-case";
import { QueryParamsDTO } from "../query-params/query-params.dto";

@ApiTags('Product')
@Controller('/products')
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateProductDTO,
  ) {
    return await this.createProductUseCase.execute(body)
  }

  @Get('/company/:companyId')
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
  async getById(
    @Param('id') productId: string,
  ) {
    return await this.getProductUseCase.execute({
      productId,
    })
  }

  @Delete('/:id')
  async delete(
    @Param('id') productId: string,
  ) {
    return await this.deleteProductUseCase.execute({
      productId,
    })
  }
}
