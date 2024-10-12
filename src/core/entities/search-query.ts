export type Direction = 'asc' | 'desc'

export abstract class SearchQuery {
  page: number
  perPage: number

  constructor(page: number, perPage: number) {
    this.page = page
    this.perPage = perPage
  }
}
