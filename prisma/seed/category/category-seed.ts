import { Prisma, PrismaClient } from '@prisma/client'

import * as categories from './category.json'

export async function categoriesSeed(prisma: PrismaClient) {
  for (const category of categories) {
    const createOrUpdate: Prisma.CategoryCreateInput = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
      company: {
        connect: {
          id: category.company_id,
        },
      },
      createdAt: new Date(category.created_at),
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
