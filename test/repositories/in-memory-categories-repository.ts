import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
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

  async findBySlug(slug: string): Promise<Category | null> {
    const item = this.items.find((item) => item.slug.value === slug)

    if (!item) {
      return null
    }

    return item
  }

  async create(category: Category) {
    this.items.push(category)
  }

  async update(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }

  async delete(categoryId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === categoryId,
    )

    this.items.splice(itemIndex, 1)
  }
}
