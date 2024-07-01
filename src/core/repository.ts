export abstract class Repository<T> {
  abstract create(record: T): Promise<void>
  abstract update(record: T): Promise<void>
  abstract delete(anId: string): Promise<void>
  abstract findById(anId: string): Promise<T | null>
}
