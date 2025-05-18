import { Repository } from '@/core/repository'

import { Ecommerce, EcommerceID } from './ecommerce'
import { ProductID } from '../product/product'
import { Slug } from '../slug/slug'

export abstract class EcommerceRepository extends Repository<Ecommerce> {
  abstract findBySlug(slug: Slug): Promise<Ecommerce | null>
  abstract findByCompanyId(companyId: string): Promise<Ecommerce | null>
  abstract addProducts(
    ecommerceId: EcommerceID,
    products: ProductID[],
  ): Promise<void>

  abstract removeProducts(
    ecommerceId: EcommerceID,
    products: ProductID[],
  ): Promise<void>
}
