import {
  DimensionsProduct,
  Product,
  ProductProps,
  StatusProduct,
} from '@/domain/enterprise/product/product'
import { Category, CategoryProps } from '@/domain/enterprise/category/category'

export interface AttachmentProps {
  id: string
  filename: string
  type: string
  url: string
}

export class GetProductOutput {
  id: string
  name: string
  description: string

  originalPrice: number
  finalPrice: number
  discountPercentage: number

  quantityInStock: number
  minimumStock: number
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

  ecommerceId?: string

  categories: {
    id: string
    name: string
    isActive: boolean
  }[]

  attachments?: {
    id: string
    filename: string
    type: string
    url: string
  }[]

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(
    aProductProps: ProductProps & { id: string },
    aCategoryProps: Required<
      {
        id: string
      } & CategoryProps
    >[],
    anAttachmentProps?: Required<
      {
        id: string
      } & AttachmentProps
    >[],
  ) {
    this.id = aProductProps.id.toString()
    this.name = aProductProps.name
    this.description = aProductProps.description

    this.originalPrice = aProductProps.originalPrice
    this.finalPrice = aProductProps.finalPrice
    this.discountPercentage = aProductProps.discountPercentage

    this.quantityInStock = aProductProps.quantityInStock
    this.minimumStock = aProductProps.minimumStock
    this.manufactureDate = aProductProps.manufactureDate
    this.dueDate = aProductProps.dueDate
    this.validityInDays = aProductProps.validityInDays

    this.unitOfMeasure = aProductProps.unitOfMeasure
    this.weight = aProductProps.weight
    this.dimensions = aProductProps.dimensions

    this.manufacturer = aProductProps.manufacturer
    this.batch = aProductProps.batch

    this.status = aProductProps.status
    this.productImage = aProductProps.productImage
    this.ecommerceId = aProductProps.ecommerceId?.toString() ?? undefined

    this.categories =
      aCategoryProps.length > 0
        ? aCategoryProps.map((category) => ({
            id: category.id.toString(),
            name: category.name,
            isActive: category.isActive,
          }))
        : []

    this.attachments =
      anAttachmentProps && anAttachmentProps.length > 0
        ? anAttachmentProps.map((file) => ({
            id: file.id,
            filename: file.filename,
            type: file.type,
            url: file.url,
          }))
        : []

    this.createdAt = aProductProps.createdAt
    this.updatedAt = aProductProps.updatedAt
    this.deletedAt = aProductProps.deletedAt
  }

  static fromAggregate(
    product: Product,
    categoriesProps: Category[],
    attachments?: AttachmentProps[],
  ) {
    const categories =
      categoriesProps.length > 0
        ? categoriesProps.map((category) => category.toJSON())
        : []

    return new GetProductOutput(product.toJSON(), categories, attachments)
  }
}
