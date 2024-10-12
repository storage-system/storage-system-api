import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/value-object'
import { Replace } from '@/core/replace'

export class FileID extends UniqueEntityID {}

export interface FileProps {
  id: FileID
  size: number
  filename: string
  path: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export type FileConstructorProps = Replace<
  FileProps,
  {
    id?: FileID
    createdAt?: Date
  }
>

export class File extends ValueObject<FileProps> {
  static create(props: FileConstructorProps) {
    const defaultProps = {
      id: new FileID(),
      createdAt: new Date(),
    }

    return new File({ ...defaultProps, ...props })
  }

  public delete() {
    this.value.deletedAt = new Date()
  }

  get id() {
    return this.value.id
  }

  get size() {
    return this.value.size
  }

  get path() {
    return this.value.path
  }

  get filename(): string {
    return this.value.filename
  }

  get type(): string {
    return this.value.filename.split('.').at(-1)!
  }

  get createdAt() {
    return this.value.createdAt
  }

  get updatedAt() {
    return this.value.updatedAt
  }

  get deletedAt() {
    return this.value.deletedAt
  }
}
