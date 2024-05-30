import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Subcategory } from '@/domain/enterprise/subcategory/subcategory';

export abstract class SubcategoriesRepository {
  abstract findById(id: string): Promise<Subcategory | null>
  abstract findAll(params: PaginationProps<Subcategory>): Promise<Pagination<Subcategory>>
  abstract findBySlug(slug: string): Promise<Subcategory | null>
  abstract create(subcategory: Subcategory): Promise<void>
  abstract save(subcategory: Subcategory): Promise<void>
  abstract delete(subcategory: Subcategory): Promise<void>
}
