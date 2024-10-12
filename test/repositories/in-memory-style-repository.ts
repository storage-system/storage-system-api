import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { SearchQuery } from '@/core/entities/search-query'
import { Pagination } from '@/core/entities/pagination'
import { Style } from '@/domain/enterprise/style/style'

export class InMemoryStyleRepository implements StyleRepository {
  public items: Style[] = []

  async findAll({ page, perPage }: SearchQuery): Promise<Pagination<Style>> {
    const items = this.items.slice((page - 1) * perPage, page * perPage)

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    })
  }

  async findById(id: string): Promise<Style | null> {
    const style = this.items.find((style) => style.id.toString() === id)

    if (!style) {
      return null
    }

    return style
  }

  async create(style: Style): Promise<void> {
    this.items.push(style)
  }

  async update(style: Style): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === style.id)
    this.items[itemIndex] = style
  }

  async delete(styleId: string): Promise<void> {
    const filteredStyles = this.items.filter(
      (style) => style.id.toString() !== styleId,
    )
    this.items = filteredStyles
  }

  async findActiveStyleByCompanyId(companyId: string): Promise<Style | null> {
    const activeStyle = this.items.find(
      (style) => style.companyId.toString() === companyId && style.isActive,
    )

    return activeStyle || null
  }
}
