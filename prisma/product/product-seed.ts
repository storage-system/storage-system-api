import { PrismaClient } from '@prisma/client'

import { generateFakeProduct } from './product'

export async function productsSeed(prisma: PrismaClient) {
  const NUM_PRODUCTS = 10

  const products = Array.from({ length: NUM_PRODUCTS }).map(() =>
    generateFakeProduct(),
  )

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
}
