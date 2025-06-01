import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/watched-list'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

export interface StyleProps {
  ecommerceId: UniqueEntityID
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

  get ecommerceId() {
    return this.props.ecommerceId.toString()
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

export class StyleWatchedList extends WatchedList<Style> {
  compareItems(a: Style, b: Style): boolean {
    return a.id.equals(b.id)
  }

  constructor(items: Style[] = []) {
    super(items)
  }

  static fromArray(items: Style[]) {
    return new StyleWatchedList(items)
  }
}
