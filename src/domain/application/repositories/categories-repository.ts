import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Category } from '@/domain/enterprise/entities/category/category'

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  findAll(params: PaginationProps<Category>): Promise<Pagination<Category>>
  create(category: Category): Promise<void>
  save(category: Category): Promise<void>
  delete(category: Category): Promise<void>
}
