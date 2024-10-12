import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { CompanyID } from '../company/company'
import { FileID } from '../file/file'
import { Slug } from '../slug/slug'

export class CategoryID extends UniqueEntityID {}

export interface CategoryProps {
  name: string
  slug: Slug
  companyId: CompanyID
  icon?: FileID
  parentId?: CategoryID
  children?: Category[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Category extends Entity<CategoryProps> {
  static create(
    props: Optional<CategoryProps, 'createdAt' | 'slug'>,
    id?: CategoryID,
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

  public update(aCategory: Partial<CategoryProps>) {
    this.props.name = aCategory.name ?? this.name
    this.props.icon = aCategory.icon ?? this.icon
    this.props.isActive = aCategory.isActive ?? this.isActive

    this.touch()
  }

  public addIcon(fileId: string) {
    this.props.icon = new FileID(fileId)
    this.touch()
  }

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

  get icon() {
    return this.props.icon
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
}
