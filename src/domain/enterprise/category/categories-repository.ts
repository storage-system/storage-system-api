import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Repository } from '@/core/repository'
import { Category } from '@/domain/enterprise/category/category'

export abstract class CategoriesRepository extends Repository<Category> {
  abstract findBySlug(slug: string): Promise<Category | null>
  abstract findAll(params: PaginationProps<Category>): Promise<Pagination<Category>>
}
