import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/watched-list'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { ProductID } from '../product/product'
import { Style } from '../style/style'
import { FileID } from '../file/file'
import { Slug } from '../slug/slug'
import { Benefit } from './benefit'
import { Hero } from './hero'

export interface EcommerceProps {
  name: string
  slug: Slug
  isActive: boolean
  companyId: UniqueEntityID
  ecommercePreview?: FileID
  styles: WatchedList<Style>
  hero: WatchedList<Hero>
  benefits: WatchedList<Benefit>
  productIds: ProductID[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class EcommerceID extends UniqueEntityID {}

export class Ecommerce extends Entity<EcommerceProps> {
  static create(
    props: Optional<
      Omit<EcommerceProps, 'styles' | 'hero'> & {
        styles: Style[]
        hero: Hero[]
      },
      'createdAt' | 'productIds'
    >,
    id?: EcommerceID,
  ) {
    const styleList = new WatchedList(props.styles, (a, b) => a.id.equals(b.id))
    const heroList = new WatchedList(props.hero, (a, b) =>
      a.fileId.equals(b.fileId),
    )

    return new Ecommerce(
      {
        ...props,
        styles: styleList,
        hero: heroList,
        createdAt: new Date(),
        productIds: [],
      },
      id,
    )
  }

  update(
    props: Partial<
      Omit<EcommerceProps, 'styles' | 'hero'> & {
        styles?: Style[]
        hero?: Hero[]
      }
    >,
  ) {
    if (props.styles) {
      this.props.styles.replace(props.styles)
    }

    if (props.hero) {
      this.props.hero.replace(props.hero)
    }

    this.props = {
      ...this.props,
      ...props,
      styles: this.props.styles,
      hero: this.props.hero,
    }

    this.touch()
  }

  updateProducts(products: { id: ProductID; action: 'add' | 'remove' }[]) {
    products.forEach((product) => {
      if (product.action === 'add') {
        this.addProduct(product.id)
      } else {
        this.removeProduct(product.id)
      }
    })

    this.touch()
  }

  addProduct(productId: ProductID) {
    if (
      !this.props.productIds.some(
        (id) => id.toString() === productId.toString(),
      )
    ) {
      this.props.productIds.push(productId)
    }
  }

  removeProduct(productId: ProductID) {
    this.props.productIds = this.props.productIds.filter(
      (id) => id.toString() !== productId.toString(),
    )
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get isActive() {
    return this.props.isActive
  }

  get ecommercePreview() {
    return this.props.ecommercePreview
  }

  get styles() {
    return this.props.styles.items
  }

  get stylesAdded() {
    return this.props.styles.getAdded()
  }

  get stylesRemoved() {
    return this.props.styles.getRemoved()
  }

  get hero() {
    return this.props.hero.items
  }

  get heroAdded() {
    return this.props.hero.getAdded()
  }

  get heroRemoved() {
    return this.props.hero.getRemoved()
  }

  get benefits() {
    return this.props.benefits.items
  }

  get benefitsAdded() {
    return this.props.benefits.getAdded()
  }

  get benefitsRemoved() {
    return this.props.benefits.getRemoved()
  }

  get productIds() {
    return this.props.productIds
  }

  get companyId() {
    return this.props.companyId
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

  touch() {
    this.props.updatedAt = new Date()
  }
}
