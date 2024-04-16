import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { Category } from '@/domain/enterprise/category/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toString() === id)

    if (!category) {
      return null
    }

    return category
  }

  async findAll({ page, perPage }: PaginationProps<Category>) {
    const items = this.items.slice((page - 1) * perPage, page * perPage)

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    })
  }

  async create(category: Category) {
    this.items.push(category)
  }

  async save(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }

  async delete(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }
}
