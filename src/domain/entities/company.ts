import { Entity } from "../../core/entities/entity"
import { UniqueEntityID } from "../../core/entities/unique-entity-id"
import { Optional } from "../../core/types/optional"

interface CompanyProps {
  name: string
  email: string
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
    id?: UniqueEntityID
  ) {
    const company = new Company({
      ...props,
      createdAt: new Date()
    }, id)

    return company
  }
}