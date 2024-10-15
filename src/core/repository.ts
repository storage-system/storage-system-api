export abstract class Repository<T> {
  abstract save(record: T): Promise<void>
  abstract update(record: T): Promise<void>
  abstract delete(anId: string): Promise<void>
  abstract findById(anId: string): Promise<T | null>
}
