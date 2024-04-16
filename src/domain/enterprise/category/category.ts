import { Slug } from '../slug/slug'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CategoryProps {
  name: string
  slug: Slug
  companyId: UniqueEntityID
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.props.slug = Slug.createFromText(name)
    this.touch()
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

  set isActive(isActive: boolean) {
    this.props.isActive = isActive
    this.touch()
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

  static create(
    props: Optional<CategoryProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: new Date(),
      },
      id,
    )

    return category
  }
}
