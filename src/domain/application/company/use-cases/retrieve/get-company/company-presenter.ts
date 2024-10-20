import { Company, CompanyProps } from '@/domain/enterprise/company/company'
import { User, UserProps } from '@/domain/enterprise/user/user'

export class CompanyPresenter {
  id: string
  tradeName: string
  corporateName: string
  cnpj: string
  email: string
  contact: string

  address: {
    street: string
    number?: string
    zipCode?: string
    neighborhood?: string
    city: string
    state: string
    country: string
    complement?: string
  }

  responsible: {
    id: string
    name: string
    email: string
    createdAt: Date
    updatedAt?: Date
  }

  createdAt: Date
  updatedAt?: Date

  constructor(
    aCompanyProps: CompanyProps & { id: string },
    anUserProps: Required<
      {
        id: string
      } & UserProps
    >,
  ) {
    this.id = aCompanyProps.id.toString()
    this.tradeName = aCompanyProps.tradeName
    this.corporateName = aCompanyProps.corporateName
    this.cnpj = aCompanyProps.cnpj
    this.email = aCompanyProps.email
    this.contact = aCompanyProps.contact
    this.address = aCompanyProps.address
    this.responsible = {
      id: anUserProps.id.toString(),
      name: anUserProps.name,
      email: anUserProps.email,
      createdAt: anUserProps.createdAt,
      updatedAt: anUserProps.updatedAt,
    }
    this.createdAt = aCompanyProps.createdAt
    this.updatedAt = aCompanyProps.updatedAt ?? undefined
  }

  static fromAggregate(aCompany: Company, anUser: User) {
    return new CompanyPresenter(aCompany.toJSON(), anUser.toJSON())
  }
}
