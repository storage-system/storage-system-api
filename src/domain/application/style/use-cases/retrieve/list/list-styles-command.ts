import { SearchQuery } from '@/core/entities/search-query'

export interface ListStylesCommandProps {
  page: number
  perPage: number
  ecommerceId: string
}

export class ListStylesCommand extends SearchQuery {
  ecommerceId?: string

  protected constructor({
    page = 1,
    perPage = 10,
    ecommerceId,
  }: Partial<ListStylesCommandProps>) {
    super(page, perPage)
    this.ecommerceId = ecommerceId
  }

  static create({
    page,
    perPage,
    ecommerceId,
  }: Partial<ListStylesCommandProps>) {
    return new ListStylesCommand({
      page,
      perPage,
      ecommerceId,
    })
  }
}
