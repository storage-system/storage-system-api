import { Category } from "../entities/category";

export interface CategoriesRepository {
  create(category: Category): Promise<void>
}