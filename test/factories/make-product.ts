import { faker } from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Product, ProductProps, StatusProduct } from "@/domain/enterprise/product/product"
import { FactoryProp } from "."

export async function makeProduct({
  repository,
  override,
}: FactoryProp<
  Product,
  Partial<
    ProductProps &
    {
      id: string
    }
  >
> = {}): Promise<Product> {
  const product = Product.create(
    {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      companyId: new UniqueEntityID(override?.companyId?.toString()),
      categoryIds: override?.categoryIds!,
      originalPrice: faker.number.int({
        max: 200,
        min: 100,
      }),
      discountPercentage: faker.number.int({
        max: 90,
        min: 1,
      }),
      finalPrice: faker.number.int({
        max: 150,
        min: 50,
      }),
      quantityInStock: faker.number.int({
        max: 100,
        min: 0
      }),
      validityInDays: faker.number.int({
        min: 1,
        max: 100,
      }),
      weight: faker.number.int(),
      status: StatusProduct.ACTIVE,
      unitOfMeasure: 'kg',
      manufactureDate: faker.date.past(),
      authorId: override?.authorId!,
      ...override,
    },
    new UniqueEntityID(override?.id),
  )

  if (repository) {
    await repository.create(product)
  }

  return product
}