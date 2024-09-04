import { User, UserProps } from '@/domain/enterprise/user/user';
import { Company, CompanyProps } from '@/domain/enterprise/company/company';
import { DimensionsProduct, Product, ProductProps, StatusProduct } from '@/domain/enterprise/product/product';
import { Category, CategoryProps } from '@/domain/enterprise/category/category';

export class ListProductsOutput {
  id: string
  name: string

  quantityInStock: number
  manufactureDate: Date
  dueDate: Date
  validityInDays: number

  manufacturer?: string
  batch?: string

  status: StatusProduct
  productImage?: string

  company: {
    id: string
    name: string
  }

  categories: {
    id: string
    name: string
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

    this.quantityInStock = aProductProps.quantityInStock;
    this.manufactureDate = aProductProps.manufactureDate;
    this.dueDate = aProductProps.dueDate;
    this.validityInDays = aProductProps.validityInDays;

    this.manufacturer = aProductProps.manufacturer;
    this.batch = aProductProps.batch;

    this.status = aProductProps.status;
    this.productImage = aProductProps.productImage;

    this.company = {
      id: aCompanyProps.id.toString(),
      name: aCompanyProps.name,
    }

    this.categories = aCategoryProps.length > 0
      ? aCategoryProps.map((category) => ({
        id: category.id.toString(),
        name: category.name,
      })) : []

    this.createdAt = aProductProps.createdAt;
    this.updatedAt = aProductProps.updatedAt;
    this.deletedAt = aProductProps.deletedAt ?? undefined;
  }

  static from(
    product: Product,
    companyProps: Company,
    categoriesProps: Category[],
  ) {

    const categories = categoriesProps.length > 0
      ? categoriesProps.map((category) => category.toJSON())
      : []

    return new ListProductsOutput(
      product.toJSON(),
      companyProps.toJSON(),
      categories,
    );
  }
}
