import {
  Product,
  ProductID,
  ProductProps,
  StatusProduct,
} from '@/domain/enterprise/product/product'
import { PrismaProductMapper } from '@/infrastructure/database/prisma/mappers/prisma-product-mapper'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeProduct({
  repository,
  override,
}: FactoryProp<
  Product,
  Partial<
    ProductProps & {
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
        max: 100,
        min: 0,
      }),
      dimensions: {
        height: '10cm',
        width: '20cm',
        depth: '5cm',
      },
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
        min: 0,
      }),
      validityInDays: faker.number.int({
        min: 1,
        max: 100,
      }),
      weight: faker.number.int({
        max: 10,
      }),
      status: StatusProduct.ACTIVE,
      unitOfMeasure: 'kg',
      manufactureDate: faker.date.past(),
      ...override,
    },
    new ProductID(override?.id),
  )

  if (repository) {
    await repository.save(product)
  }

  return product
}

@Injectable()
export class ProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = await makeProduct({ override: data })

    await this.prisma.product.create({
      data: PrismaProductMapper.toPersistence(product),
    })

    return product
  }
}
