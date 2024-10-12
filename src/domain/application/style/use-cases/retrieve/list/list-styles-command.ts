import { SearchQuery } from '@/core/entities/search-query'

export interface ListStylesCommandProps {
  page: number
  perPage: number
  companyId: string
}

export class ListStylesCommand extends SearchQuery {
  companyId?: string

  protected constructor({
    page = 1,
    perPage = 10,
    companyId,
  }: Partial<ListStylesCommandProps>) {
    super(page, perPage)
    this.companyId = companyId
  }

  static create({ page, perPage, companyId }: Partial<ListStylesCommandProps>) {
    return new ListStylesCommand({
      page,
      perPage,
      companyId,
    })
  }
}
