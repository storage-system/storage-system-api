import { ValueObject } from '@/core/value-object'

export interface CompanyAddressProps {
  street: string
  number?: string
  zipCode?: string
  neighborhood?: string
  city: string
  state: string
  country: string
  complement?: string
}

export class CompanyAddress extends ValueObject<CompanyAddressProps> {
  static create(props: CompanyAddressProps) {
    return new CompanyAddress(props)
  }

  get street() {
    return this.value.street
  }

  get number() {
    return this.value.number
  }

  get neighborhood() {
    return this.value.neighborhood
  }

  get city() {
    return this.value.city
  }

  get state() {
    return this.value.state
  }

  get country() {
    return this.value.country
  }

  get zipCode() {
    return this.value.zipCode
  }

  get complement() {
    return this.value.complement
  }
}
