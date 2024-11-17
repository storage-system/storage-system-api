import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import { Replace } from '@/core/replace'
import { addDays } from 'date-fns'

import { CategoryID } from '../category/category'
import { CompanyID } from '../company/company'
import { Slug } from '../slug/slug'

export enum StatusProduct {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface DimensionsProduct {
  height: string
  width: string
  depth: string
}

export class ProductID extends UniqueEntityID {}

export interface ProductProps {
  name: string
  slug: Slug
  description: string
  fileIds: string[]

  originalPrice: number
  finalPrice: number
  discountPercentage: number

  quantityInStock: number
  manufactureDate: Date
  dueDate: Date
  validityInDays: number

  unitOfMeasure: string
  weight: number
  dimensions?: DimensionsProduct

  manufacturer?: string
  batch?: string

  status: StatusProduct
  productImage?: string

  companyId: CompanyID
  categoryIds: CategoryID[]

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export type ProductConstructorProps = Replace<
  ProductProps,
  {
    slug?: Slug
    manufactureDate?: Date
    dueDate?: Date
    createdAt?: Date
  }
>

export class Product extends Entity<ProductProps> {
  static create(props: ProductConstructorProps, id?: ProductID) {
    const manufactureDate = props.manufactureDate ?? new Date()
    const dueDate = addDays(manufactureDate, props.validityInDays)

    const product = new Product(
      {
        slug: props.slug ?? Slug.createFromText(props.name),
        manufactureDate,
        dueDate,
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return product
  }

  update(aProduct: Partial<ProductProps>) {
    if (aProduct.name && aProduct.name !== this.props.name) {
      this.props.name = aProduct.name ?? this.name
      this.props.slug = Slug.createFromText(aProduct.name)
    }
    this.props.description = aProduct.description ?? this.description

    this.props.originalPrice = aProduct.originalPrice ?? this.originalPrice
    this.props.finalPrice = aProduct.finalPrice ?? this.finalPrice
    this.props.discountPercentage =
      aProduct.discountPercentage ?? this.discountPercentage

    this.props.quantityInStock =
      aProduct.quantityInStock ?? this.quantityInStock
    this.props.manufactureDate =
      aProduct.manufactureDate ?? this.manufactureDate
    this.props.validityInDays = aProduct.validityInDays ?? this.validityInDays

    this.props.unitOfMeasure = aProduct.unitOfMeasure ?? this.unitOfMeasure
    this.props.weight = aProduct.weight ?? this.weight
    this.props.dimensions = aProduct.dimensions ?? this.dimensions

    this.props.manufacturer = aProduct.manufacturer ?? this.manufacturer
    this.props.batch = aProduct.batch ?? this.batch

    this.props.status = aProduct.status ?? this.status
    this.props.productImage = aProduct.productImage ?? this.productImage

    this.props.categoryIds = aProduct.categoryIds ?? this.categoryIds
    this.props.fileIds = aProduct.fileIds ?? this.fileIds

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

  get description() {
    return this.props.description
  }

  get fileIds() {
    return this.props.fileIds
  }

  get originalPrice() {
    return this.props.originalPrice
  }

  get finalPrice() {
    return this.props.finalPrice
  }

  get discountPercentage() {
    return this.props.discountPercentage
  }

  get quantityInStock() {
    return this.props.quantityInStock
  }

  get manufactureDate() {
    return this.props.manufactureDate
  }

  get dueDate() {
    return this.props.dueDate
  }

  get validityInDays() {
    return this.props.validityInDays
  }

  get unitOfMeasure() {
    return this.props.unitOfMeasure
  }

  get weight() {
    return this.props.weight
  }

  get dimensions() {
    return this.props.dimensions
  }

  get manufacturer() {
    return this.props.manufacturer
  }

  get batch() {
    return this.props.batch
  }

  get status() {
    return this.props.status
  }

  get productImage() {
    return this.props.productImage
  }

  get companyId() {
    return this.props.companyId
  }

  get categoryIds() {
    return this.props.categoryIds
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
