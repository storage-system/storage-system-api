import { CategoriesRepository } from "@/domain/application/repositories/categories-repository";
import { Category } from "@/domain/enterprise/entities/category";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toString() === id)

    if (!category) {
      return null
    }

    return category
  }

  async create(category: Category) {
    this.items.push(category)
  }

  async delete(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }
}