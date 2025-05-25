import { PrismaClient, StatusProduct } from '@prisma/client'

import * as products from './product.json'

export async function productsSeed(prisma: PrismaClient) {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        originalPrice: product.original_price,
        finalPrice: product.final_price,
        discountPercentage: product.discount_percentage,
        quantityInStock: product.quantity_in_stock,
        manufactureDate: new Date(product.manufacture_date),
        dueDate: new Date(product.due_date),
        validityInDays: product.validity_in_days,
        minimumStock: product.minimum_stock,
        unitOfMeasure: product.unit_of_measure,
        weight: product.weight,
        dimensionsHeight: product.dimensions_height,
        dimensionsWidth: product.dimensions_width,
        dimensionsDepth: product.dimensions_depth,
        manufacturer: product.manufacturer ?? undefined,
        batch: product.batch ?? undefined,
        status: product.status as StatusProduct,
        company: {
          connect: {
            id: product.company_id,
          },
        },
      },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        originalPrice: product.original_price,
        finalPrice: product.final_price,
        discountPercentage: product.discount_percentage,
        quantityInStock: product.quantity_in_stock,
        manufactureDate: new Date(product.manufacture_date),
        dueDate: new Date(product.due_date),
        validityInDays: product.validity_in_days,
        minimumStock: product.minimum_stock,
        unitOfMeasure: product.unit_of_measure,
        weight: product.weight,
        dimensionsHeight: product.dimensions_height,
        dimensionsWidth: product.dimensions_width,
        dimensionsDepth: product.dimensions_depth,
        manufacturer: product.manufacturer ?? undefined,
        batch: product.batch ?? undefined,
        status: product.status as StatusProduct,
        company: {
          connect: {
            id: product.company_id,
          },
        },
        updatedAt: new Date(),
      },
    })
  }
}
