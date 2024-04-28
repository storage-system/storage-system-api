import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CompanyProps {
  name: string
  email: string
  password: string
  contact: string
  responsible: string
  createdAt: Date
  updatedAt?: Date
}

export class Company extends Entity<CompanyProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get contact() {
    return this.props.contact
  }

  set contact(contact: string) {
    this.props.contact = contact
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get responsible() {
    return this.props.responsible
  }

  set responsible(responsible: string) {
    this.props.responsible = responsible
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CompanyProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
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

    this.touch()
  }
}
