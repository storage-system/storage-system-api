import { PrismaClient } from '@prisma/client'

import { usersSeed } from './user/user-seed'

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await usersSeed(prisma)
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
