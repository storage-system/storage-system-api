import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { SubcategoriesRepository } from '@/domain/application/subcategory/subcategories-repository'
import { Subcategory } from '@/domain/enterprise/subcategory/subcategory'

export class InMemorySubcategoriesRepository implements SubcategoriesRepository {
  public items: Subcategory[] = []

  async findById(id: string) {
    const subcategory = this.items.find((item) => item.id.toString() === id)

    if (!subcategory) {
      return null
    }

    return subcategory
  }

  async findAll({ page, perPage }: PaginationProps<Subcategory>) {
    const items = this.items.slice((page - 1) * perPage, page * perPage)

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    })
  }

  async findBySlug(slug: string): Promise<Subcategory | null> {
    const item = this.items.find((item) => item.slug.value === slug)

    if (!item) {
      return null
    }

    return item
  }

  async create(subcategory: Subcategory) {
    this.items.push(subcategory)
  }

  async save(subcategory: Subcategory) {
    const itemIndex = this.items.findIndex((item) => item.id === subcategory.id)

    this.items[itemIndex] = subcategory
  }

  async delete(subcategory: Subcategory) {
    const itemIndex = this.items.findIndex((item) => item.id === subcategory.id)

    this.items.splice(itemIndex, 1)
  }
}
