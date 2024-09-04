import { Company, CompanyProps } from '@/domain/enterprise/company/company';
import { DimensionsProduct, Product, ProductProps, StatusProduct } from '@/domain/enterprise/product/product';
import { Category, CategoryProps } from '@/domain/enterprise/category/category';

export class GetProductOutput {
  id: string
  name: string
  description: string

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

  company: {
    id: string
    name: string
    email: string
    responsible: string
    createdAt: Date
  }

  categories: {
    id: string
    name: string
    isActive: boolean
  }[]

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(
    aProductProps: ProductProps & { id: string },
    aCompanyProps: Required<
      {
        id: string;
      } & CompanyProps
    >,
    aCategoryProps: Required<
      {
        id: string
      } & CategoryProps
    >[],
  ) {
    this.id = aProductProps.id.toString();
    this.name = aProductProps.name;
    this.description = aProductProps.description;

    this.originalPrice = aProductProps.originalPrice;
    this.finalPrice = aProductProps.finalPrice;
    this.discountPercentage = aProductProps.discountPercentage;

    this.quantityInStock = aProductProps.quantityInStock;
    this.manufactureDate = aProductProps.manufactureDate;
    this.dueDate = aProductProps.dueDate;
    this.validityInDays = aProductProps.validityInDays;

    this.unitOfMeasure = aProductProps.unitOfMeasure;
    this.weight = aProductProps.weight;
    this.dimensions = aProductProps.dimensions;

    this.manufacturer = aProductProps.manufacturer;
    this.batch = aProductProps.batch;

    this.status = aProductProps.status;
    this.productImage = aProductProps.productImage;

    this.company = {
      id: aCompanyProps.id.toString(),
      name: aCompanyProps.name,
      email: aCompanyProps.email,
      responsible: aCompanyProps.responsible,
      createdAt: aCompanyProps.createdAt,
    }

    this.categories = aCategoryProps.length > 0
      ? aCategoryProps.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        isActive: category.isActive,
      })) : []

    this.createdAt = aProductProps.createdAt;
    this.updatedAt = aProductProps.updatedAt;
    this.deletedAt = aProductProps.deletedAt
  }

  static fromAggregate(
    product: Product,
    companyProps: Company,
    categoriesProps: Category[],
  ) {

    const categories = categoriesProps.length > 0
      ? categoriesProps.map((category) => category.toJSON())
      : []

    return new GetProductOutput(
      product.toJSON(),
      companyProps.toJSON(),
      categories,
    );
  }
}
