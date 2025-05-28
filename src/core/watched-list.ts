export class WatchedList<T> {
  private current: T[]
  private added: T[] = []
  private removed: T[] = []

  constructor(
    initialItems: T[],
    private compareFn: (a: T, b: T) => boolean,
  ) {
    this.current = [...initialItems]
  }

  static fromArray<T>(items: T[]): WatchedList<T> {
    return new WatchedList<T>(items, (a, b) => a === b)
  }

  get items(): T[] {
    return [...this.current]
  }

  getAdded(): T[] {
    return [...this.added]
  }

  getRemoved(): T[] {
    return [...this.removed]
  }

  replace(newItems: T[]) {
    const added = newItems.filter(
      (item) => !this.current.some((curr) => this.compareFn(curr, item)),
    )
    const removed = this.current.filter(
      (item) => !newItems.some((n) => this.compareFn(n, item)),
    )

    this.added = added
    this.removed = removed
    this.current = [...newItems]
  }
}
