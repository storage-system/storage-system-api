import { Prisma, PrismaClient } from '@prisma/client'

import { categories } from './category'

export async function categoriesSeed(prisma: PrismaClient) {
  for (const category of categories) {
    const createOrUpdate: Prisma.CategoryCreateInput = {
      id: category.id,
      name: category.name,

      isActive: category.isActive,
      company: {
        connect: {
          id: 'cfdbc8b8-fdb4-47b1-b9fc-b6b549e78541',
        },
      },
      slug: category.name,
    }

    await prisma.category.upsert({
      where: {
        id: category.id,
      },
      create: createOrUpdate,
      update: createOrUpdate,
    })
  }
}
