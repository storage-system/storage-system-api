/* eslint-disable @typescript-eslint/no-explicit-any */
export class Pagination<T> {
  #total: number

  #items: Array<T>

  #perPage: number

  #currentPage: number

  constructor(
    public readonly total: number,
    public readonly items: Array<T>,
    public readonly perPage: number,
    public readonly currentPage: number,
  ) {
    this.#total = total
    this.#items = items
    this.#perPage = perPage
    this.#currentPage = currentPage
  }

  public map<R>(mapperFn: (t: T) => R): Pagination<any> {
    const aNewList = this.#items.map((_item: T): R => mapperFn(_item))

    return new Pagination<any>(
      this.#total,
      aNewList,
      this.#perPage,
      this.#currentPage,
    )
  }
}
