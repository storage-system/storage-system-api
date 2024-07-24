import { Repository } from '@/core/repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Product } from '@/domain/enterprise/product/product'

export abstract class ProductsRepository extends Repository<Product> {
  abstract findAll(params: PaginationProps<Product>): Promise<Pagination<Product>>
}
