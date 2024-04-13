import { Entity } from "../../core/entities/entity"

interface CompanyProps {
  name: string
  email: string
  contact: string
  createdAt: string
  responsible: string
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
}