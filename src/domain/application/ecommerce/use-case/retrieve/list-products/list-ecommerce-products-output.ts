import {
  Product,
  ProductProps,
  StatusProduct,
} from '@/domain/enterprise/product/product'
import { Category, CategoryProps } from '@/domain/enterprise/category/category'

export class ListEcommerceProductsOutput {
  id: string
  name: string

  quantityInStock: number
  minimumStock: number
  manufactureDate: Date
  dueDate: Date
  validityInDays: number

  manufacturer?: string
  batch?: string

  status: StatusProduct
  productImage?: string

  categories: {
    id: string
    name: string
  }[]

  price: number

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
    productImage?: string,
  ) {
    this.id = aProductProps.id.toString()
    this.name = aProductProps.name

    this.quantityInStock = aProductProps.quantityInStock
    this.minimumStock = aProductProps.minimumStock
    this.manufactureDate = aProductProps.manufactureDate
    this.dueDate = aProductProps.dueDate
    this.validityInDays = aProductProps.validityInDays

    this.price = aProductProps.finalPrice

    this.manufacturer = aProductProps.manufacturer
    this.batch = aProductProps.batch

    this.status = aProductProps.status
    this.productImage = productImage

    this.categories =
      aCategoryProps.length > 0
        ? aCategoryProps.map((category) => ({
            id: category.id.toString(),
            name: category.name,
          }))
        : []

    this.createdAt = aProductProps.createdAt
    this.updatedAt = aProductProps.updatedAt
    this.deletedAt = aProductProps.deletedAt ?? undefined
  }

  static from(
    product: Product,
    categoriesProps: Category[],
    productImage?: string,
  ) {
    const categories =
      categoriesProps.length > 0
        ? categoriesProps.map((category) => category.toJSON())
        : []

    return new ListEcommerceProductsOutput(
      product.toJSON(),
      categories,
      productImage,
    )
  }
}
