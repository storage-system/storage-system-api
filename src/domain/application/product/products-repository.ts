import { Repository } from '@/core/repository'
import { Pagination } from '@/core/entities/pagination'
import { Product } from '@/domain/enterprise/product/product'
import { ListProductsCommand } from './use-cases/retrieve/list/list-products-command'

export abstract class ProductsRepository extends Repository<Product> {
  abstract findAll(params: ListProductsCommand): Promise<Pagination<Product>>
}
