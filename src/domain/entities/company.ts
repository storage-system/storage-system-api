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