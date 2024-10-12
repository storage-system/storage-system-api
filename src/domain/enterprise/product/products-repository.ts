import { Product } from '@/domain/enterprise/product/product'
import { Pagination } from '@/core/entities/pagination'
import { Repository } from '@/core/repository'

import { ListProductsCommand } from '../../application/product/use-cases/retrieve/list/list-products-command'

export abstract class ProductsRepository extends Repository<Product> {
  abstract findAll(params: ListProductsCommand): Promise<Pagination<Product>>
}
