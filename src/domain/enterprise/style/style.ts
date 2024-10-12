import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

export interface StyleProps {
  companyId: UniqueEntityID
  name: string
  isActive: boolean
  backgroundColor: string
  textColor: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class StyleID extends UniqueEntityID {}

export class Style extends Entity<StyleProps> {
  static create(props: Optional<StyleProps, 'createdAt'>, id?: StyleID) {
    const style = new Style(
      {
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return style
  }

  update(aStyle: Partial<StyleProps>) {
    this.props.name = aStyle.name ?? this.name
    this.props.backgroundColor = aStyle.backgroundColor ?? this.backgroundColor
    this.props.textColor = aStyle.textColor ?? this.textColor
    this.props.primaryColor = aStyle.primaryColor ?? this.primaryColor
    this.props.secondaryColor = aStyle.secondaryColor ?? this.secondaryColor
    this.props.tertiaryColor = aStyle.tertiaryColor ?? this.tertiaryColor
    this.touch()
  }

  chooseActiveStyle() {
    this.props.isActive = true
  }

  deactivateStyle() {
    this.props.isActive = false
  }

  delete() {
    this.props.deletedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  get isActive() {
    return this.props.isActive
  }

  get companyId() {
    return this.props.companyId.toString()
  }

  get backgroundColor() {
    return this.props.backgroundColor
  }

  get textColor() {
    return this.props.textColor
  }

  get primaryColor() {
    return this.props.primaryColor
  }

  get secondaryColor() {
    return this.props.secondaryColor
  }

  get tertiaryColor() {
    return this.props.tertiaryColor
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
