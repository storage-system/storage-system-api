import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { ProductID } from '../product/product'
import { Style } from '../style/style'
import { FileID } from '../file/file'
import { Slug } from '../slug/slug'
import { Hero } from './hero'

interface EcommerceProps {
  name: string
  slug: Slug
  isActive: boolean
  companyId: UniqueEntityID
  ecommercePreview?: FileID
  styles: Style[]
  hero: Hero[]
  productIds: ProductID[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class EcommerceID extends UniqueEntityID {}

export class Ecommerce extends Entity<EcommerceProps> {
  static create(
    props: Optional<EcommerceProps, 'createdAt' | 'productIds'>,
    id?: EcommerceID,
  ) {
    return new Ecommerce(
      { createdAt: new Date(), productIds: [], ...props },
      id,
    )
  }

  update(props: Partial<EcommerceProps>) {
    this.props = {
      ...this.props,
      ...props,
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
    return this.props.styles
  }

  get hero() {
    return this.props.hero
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
