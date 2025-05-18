import { Repository } from '@/core/repository'

import { Ecommerce } from './ecommerce'
import { Slug } from '../slug/slug'

export abstract class EcommerceRepository extends Repository<Ecommerce> {
  abstract findBySlug(slug: Slug): Promise<Ecommerce | null>
  abstract findByCompanyId(companyId: string): Promise<Ecommerce | null>
}
