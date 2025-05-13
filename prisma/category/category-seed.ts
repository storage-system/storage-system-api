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
          id: '2985d31b-26b8-4eee-b64d-f26a916004d7',
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
