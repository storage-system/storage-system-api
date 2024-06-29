import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Product } from '@/domain/enterprise/product/product'

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findAll(params: PaginationProps<Product>): Promise<Pagination<Product>>
  abstract findBySlug(slug: string): Promise<Product | null>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
  abstract delete(productId: string): Promise<void>
}
