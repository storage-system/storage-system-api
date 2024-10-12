import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Category } from '@/domain/enterprise/category/category'
import { Repository } from '@/core/repository'

export abstract class CategoriesRepository extends Repository<Category> {
  abstract findBySlug(slug: string): Promise<Category | null>
  abstract findAll(
    params: PaginationProps<Category>,
  ): Promise<Pagination<Category>>
}
