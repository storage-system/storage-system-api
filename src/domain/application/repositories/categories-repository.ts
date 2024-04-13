import { Category } from '@/domain/enterprise/entities/category'

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  create(category: Category): Promise<void>
  delete(category: Category): Promise<void>
}
