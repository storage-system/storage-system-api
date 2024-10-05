import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/value-object'
import { Replace } from '@/core/replace'
import { CompanyID } from '../company/company'

export class FileID extends UniqueEntityID {}

export interface FileProps {
  id: FileID
  companyId?: CompanyID
  size: number
  filename: string
  path: string
  createdAt: Date
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

  get id() {
    return this.value.id
  }

  get size() {
    return this.value.size
  }

  get path() {
    return this.value.path
  }

  get createdAt() {
    return this.value.createdAt
  }

  get filename(): string {
    return this.value.filename
  }

  get filetype(): string {
    return this.value.filename.split('.').at(-1)!
  }

  get companyId() {
    return this.value.companyId
  }
}
