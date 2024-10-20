import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { CompanyAddressProps } from './company-address'

export class CompanyID extends UniqueEntityID {}

export interface CompanyProps {
  tradeName: string
  corporateName: string
  cnpj: string
  email: string
  contact: string
  responsibleId: string
  address: CompanyAddressProps
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Company extends Entity<CompanyProps> {
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
    this.props.tradeName = aCompany.tradeName ?? this.tradeName
    this.props.corporateName = aCompany.corporateName ?? this.corporateName
    this.props.cnpj = aCompany.cnpj ?? this.cnpj
    this.props.email = aCompany.email ?? this.email
    this.props.contact = aCompany.contact ?? this.contact

    this.touch()
  }

  get tradeName() {
    return this.props.tradeName
  }

  get corporateName() {
    return this.props.corporateName
  }

  get cnpj() {
    return this.props.cnpj
  }

  get email() {
    return this.props.email
  }

  get contact() {
    return this.props.contact
  }

  get responsibleId() {
    return this.props.responsibleId
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
