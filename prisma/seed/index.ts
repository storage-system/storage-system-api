/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

import { categoriesSeed } from './category/category-seed'
import { productsSeed } from './product/product-seed'
import { companySeed } from './company/company-seed'
import { addressSeed } from './address/address-seed'
import { usersSeed } from './user/user-seed'

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🌱 Seeding users...')
    await usersSeed(prisma)

    console.log('📍 Seeding addresses...')
    await addressSeed(prisma) // ← primeiro

    console.log('🏢 Seeding companies...')
    await companySeed(prisma)

    console.log('🏷️ Seeding categories...')
    await categoriesSeed(prisma)

    console.log('📦 Seeding products...')
    await productsSeed(prisma)

    console.log('✅ Seed finalizado com sucesso.')
  } else {
    console.log('⚠️ Seed ignorado fora do ambiente de desenvolvimento.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
