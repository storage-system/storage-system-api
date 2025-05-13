import { PrismaClient } from '@prisma/client'

import { categoriesSeed } from './category/category-seed'
import { productsSeed } from './product/product-seed'
import { companySeed } from './company/company-seed'
import { usersSeed } from './user/user-seed'

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await usersSeed(prisma)
    await companySeed(prisma)
    await categoriesSeed(prisma)
    await productsSeed(prisma)
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
