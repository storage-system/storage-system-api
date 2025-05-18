import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { Product } from '../product/product'
import { Style } from '../style/style'
import { Slug } from '../slug/slug'

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
  products: Product[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Ecommerce extends Entity<EcommerceProps> {
  static create(
    props: Optional<EcommerceProps, 'createdAt' | 'products'>,
    id?: UniqueEntityID,
  ) {
    return new Ecommerce({ createdAt: new Date(), products: [], ...props }, id)
  }

  update(props: Partial<EcommerceProps>) {
    this.props = {
      ...this.props,
      ...props,
    }
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

  get products() {
    return this.props.products
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
}
