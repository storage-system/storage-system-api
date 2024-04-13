import { CategoriesRepository } from "@/domain/application/repositories/categories-repository";
import { Category } from "@/domain/enterprise/entities/category";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async create(category: Category) {
    this.items.push(category)
  }
}