import { randomUUID } from "crypto"

interface CompanyProps {
  name: string
  email: string
  contact: string
  createdAt: string
  responsible: string
}

export class Company {
  public id: string
  public name: string
  public email: string
  public contact: string
  public createdAt: Date
  public responsible: string

  constructor(props: CompanyProps, id?: string) {
    this.name = props.name,
    this.email = props.email
    this.contact = props.contact,
    this.responsible = props.responsible
    this.createdAt = new Date()
    this.id = id ?? randomUUID()
  }
}