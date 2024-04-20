import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Category } from '@/domain/enterprise/category/category'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findAll(params: PaginationProps<Category>): Promise<Pagination<Category>>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
}
