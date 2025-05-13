import { StatusProduct } from '@prisma/client'
import { faker } from '@faker-js/faker'

import { Slug } from './slug'

export function generateFakeProduct() {
  const productName = faker.commerce.productName()

  return {
    name: productName,
    description: faker.commerce.productDescription(),
    originalPrice: Number(faker.commerce.price({ min: 50, max: 500 })),
    finalPrice: Number(faker.commerce.price({ min: 30, max: 400 })),
    discountPercentage: faker.number.float({ min: 0, max: 100 }),
    quantityInStock: faker.number.int({ min: 0, max: 1000 }),
    minimumStock: faker.number.int({ min: 0, max: 100 }),
    manufactureDate: faker.date.past(),
    validityInDays: faker.number.int({ min: 1, max: 365 }),
    unitOfMeasure: faker.helpers.arrayElement(['kg', 'un', 'ml', 'l']),
    weight: faker.number.float({ min: 0.1, max: 100, precision: 0.01 }),
    dimensionsHeight: faker.string.numeric(2),
    dimensionsWidth: faker.string.numeric(2),
    dimensionsDepth: faker.string.numeric(2),
    manufacturer: faker.company.name(),
    batch: faker.string.alphanumeric(8),
    status: faker.helpers.arrayElement(Object.values(StatusProduct)),
    companyId: '2985d31b-26b8-4eee-b64d-f26a916004d7',
    dueDate: faker.date.future(),
    slug: Slug.createFromText(productName).value,
    categories: {
      connect: {
        id: 'f210dd8e-6a4e-409e-b58f-f8b2a3368735',
      },
    },
  }
}
