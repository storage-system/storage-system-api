import { Slug } from '../slug/slug'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SubcategoryProps {
  name: string
  slug: Slug
  categoryId: UniqueEntityID
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Subcategory extends Entity<SubcategoryProps> {
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

  get categoryId() {
    return this.props.categoryId
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
    props: Optional<SubcategoryProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const subcategory = new Subcategory(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: new Date(),
      },
      id,
    )

    return subcategory
  }

  update(aSubcategory: Partial<SubcategoryProps>) {
    this.props.name = aSubcategory.name ?? this.name
    this.props.categoryId = aSubcategory.categoryId ?? this.categoryId
    this.props.isActive = aSubcategory.isActive ?? this.isActive

    this.touch()
  }
}
