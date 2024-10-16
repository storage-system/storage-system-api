import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

export class CompanyID extends UniqueEntityID {}

export interface CompanyProps {
  name: string
  email: string
  contact: string
  responsible: string
  users: string[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Company extends Entity<CompanyProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get contact() {
    return this.props.contact
  }

  get createdAt() {
    return this.props.createdAt
  }

  get responsible() {
    return this.props.responsible
  }

  get users() {
    return this.props.users
  }

  set users(userIds: string[]) {
    this.props.users = userIds
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<CompanyProps, 'createdAt'>, id?: CompanyID) {
    const company = new Company(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return company
  }

  update(aCompany: Partial<CompanyProps>) {
    this.props.name = aCompany.name ?? this.name
    this.props.email = aCompany.email ?? this.email
    this.props.contact = aCompany.contact ?? this.contact
    this.props.responsible = aCompany.responsible ?? this.responsible
    this.props.users = aCompany.users ?? this.users

    this.touch()
  }

  public assignCompany(userId: string) {
    this.users.push(userId)
  }
}
