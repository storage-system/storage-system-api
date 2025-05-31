import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { Style, StyleWatchedList } from '../style/style'
import { Benefit, BenefitWatchedList } from './benefit'
import { ProductID } from '../product/product'
import { Hero, HeroWatchedList } from './hero'
import { FileID } from '../file/file'
import { Slug } from '../slug/slug'

export interface EcommerceProps {
  name: string
  slug: Slug
  isActive: boolean
  companyId: UniqueEntityID
  ecommercePreview?: FileID
  styles: StyleWatchedList
  hero: HeroWatchedList
  benefits: BenefitWatchedList
  productIds: ProductID[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class EcommerceID extends UniqueEntityID {}

export class Ecommerce extends Entity<EcommerceProps> {
  static create(
    props: Optional<
      Omit<EcommerceProps, 'styles' | 'hero' | 'benefits'> & {
        styles: Style[]
        hero: Hero[]
        benefits: Benefit[]
      },
      'createdAt' | 'productIds'
    >,
    id?: EcommerceID,
  ) {
    const styleList = new StyleWatchedList(props.styles)
    const heroList = new HeroWatchedList(props.hero)
    const benefitList = new BenefitWatchedList(props.benefits)

    return new Ecommerce(
      {
        ...props,
        styles: styleList,
        hero: heroList,
        benefits: benefitList,
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
      this.props.styles.update(props.styles)
    }

    if (props.hero) {
      this.props.hero.update(props.hero)
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
    return this.props.styles.getItems()
  }

  get stylesAdded() {
    return this.props.styles.getNewItems()
  }

  get stylesRemoved() {
    return this.props.styles.getRemovedItems()
  }

  get hero() {
    return this.props.hero.getItems()
  }

  get heroAdded() {
    return this.props.hero.getNewItems()
  }

  get heroRemoved() {
    return this.props.hero.getRemovedItems()
  }

  get benefits() {
    return this.props.benefits.getItems()
  }

  get benefitsAdded() {
    return this.props.benefits.getNewItems()
  }

  get benefitsRemoved() {
    return this.props.benefits.getRemovedItems()
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
