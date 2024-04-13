import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"
import { Optional } from "../../core/types/optional"
import { UniqueEntityID } from "../../core/entities/unique-entity-id"

interface CategoryProps {
  name: string
  slug: Slug
  companyId: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
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
  
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const category = new Category({
      ...props,
      createdAt: new Date()
    }, id)

    return category
  }
}