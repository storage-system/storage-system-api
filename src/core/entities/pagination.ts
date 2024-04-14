export type SearchParams<T> = {
  filters?: T
  page: number
  perPage: number
}

export interface PaginationProps<T> {
  total?: number
  perPage: number
  items?: Array<T>
  page: number
}

export class Pagination<T> {
  /**
   * @var total
   */
  total?: number

  /**
   * @var items
   */
  items: Array<T>

  /**
   * @var perPage
   */
  perPage: number

  /**
   * @var page
   */
  page: number

  /**
   * Class constructor
   * @param props
   */
  constructor(props: PaginationProps<T>) {
    this.total = props.total ?? 0
    this.items = props.items ?? []
    this.perPage = props.perPage
    this.page = props.page
  }

  map<R>(mapperFn: (t: T) => R): Pagination<unknown> {
    const aNewList = this.items.map(mapperFn)

    return new Pagination<unknown>({
      total: this.total,
      items: aNewList,
      perPage: this.perPage,
      page: this.page,
    })
  }
}
