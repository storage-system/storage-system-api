import { randomUUID } from "crypto"
import { Slug } from "./value-objects/slug"

interface CategoryProps {
  name: string
  slug: Slug
  companyId: string
  isActive: boolean
}

export class Category {
  public id: string
  public name: string
  public slug: Slug
  public companyId: string
  public isActive: boolean

  constructor(props: CategoryProps, id?: string) {
    this.name = props.name,
    this.slug = props.slug
    this.companyId = props.companyId,
    this.isActive = props.isActive
    this.id = id ?? randomUUID()
  }
}