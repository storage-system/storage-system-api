import { Category } from '@/domain/enterprise/entities/category'

export interface CategoriesRepository {
  create(category: Category): Promise<void>
}
