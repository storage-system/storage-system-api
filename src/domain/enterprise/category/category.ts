import { Slug } from '../slug/slug'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CategoryProps {
  name: string
  slug: Slug
  companyId: UniqueEntityID
  parentId?: UniqueEntityID
  children?: Category[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
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
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return category
  }

  update(aCategory: Partial<CategoryProps>) {
    this.props.name = aCategory.name ?? this.name
    this.props.isActive = aCategory.isActive ?? this.isActive

    this.touch()
  }
}
