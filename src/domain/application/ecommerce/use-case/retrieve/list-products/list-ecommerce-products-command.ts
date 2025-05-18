import { SearchQuery } from '@/core/entities/search-query'
import { Optional } from '@/core/types/optional'

export interface ListEcommerceProductsCommandProps {
  page: number
  perPage: number
  ecommerceSlug: string
  categoryId?: string
}

export class ListEcommerceProductsCommand extends SearchQuery {
  ecommerceSlug: string
  categoryId?: string

  protected constructor({
    ecommerceSlug,
    categoryId,
    page = 1,
    perPage = 10,
  }: ListEcommerceProductsCommandProps) {
    super(page, perPage)
    this.ecommerceSlug = ecommerceSlug
    this.categoryId = categoryId
  }

  static create({
    page,
    perPage,
    ecommerceSlug,
    categoryId,
  }: Optional<ListEcommerceProductsCommandProps, 'page' | 'perPage'>) {
    return new ListEcommerceProductsCommand({
      page: page ?? 1,
      perPage: perPage ?? 10,
      ecommerceSlug,
      categoryId,
    })
  }
}
