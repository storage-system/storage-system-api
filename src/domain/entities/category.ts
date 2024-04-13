import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"

interface CategoryProps {
  name: string
  slug: Slug
  companyId: string
  isActive: boolean
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get companyId() {
    return this.props.companyId
  }

  get isActive() {
    return this.props.isActive
  }
}