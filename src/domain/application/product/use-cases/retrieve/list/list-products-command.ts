import { SearchQuery } from '@/core/entities/search-query'

export interface ListProductsCommandProps {
  page: number
  perPage: number
  companyId: string
}

export class ListProductsCommand extends SearchQuery {
  companyId?: string

  protected constructor({
    page = 1,
    perPage = 10,
    companyId,
  }: Partial<ListProductsCommandProps>) {
    super(page, perPage)
    this.companyId = companyId
  }

  static create({
    page,
    perPage,
    companyId,
  }: Partial<ListProductsCommandProps>) {
    return new ListProductsCommand({
      page,
      perPage,
      companyId,
    })
  }
}
