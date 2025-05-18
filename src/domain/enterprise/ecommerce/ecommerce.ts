import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { Product, ProductID } from '../product/product'
import { Style } from '../style/style'
import { Slug } from '../slug/slug'
import { File } from '../file/file'

// model Ecommerce {
//     id        String    @id @default(uuid())
//     name      String
//     slug      String    @unique
//     isActive  Boolean   @default(false) @map("is_active")
//     createdAt DateTime  @default(now()) @map("created_at")
//     updatedAt DateTime? @updatedAt @map("updated_at")
//     deletedAt DateTime? @map("deleted_at")

//     styles Style[]

//     products Product[]

//     companyId String  @unique @map("company_id")
//     company   Company @relation(fields: [companyId], references: [id])

//     @@map("ecommerces")
//   }

interface EcommerceProps {
  name: string
  slug: Slug
  isActive: boolean
  companyId: UniqueEntityID
  styles: Style[]
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

  get styles() {
    return this.props.styles
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
