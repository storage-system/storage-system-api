import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { users } from './users'

export async function usersSeed(prisma: PrismaClient) {
  for (const user of users) {
    const hashedPassword = await hash(user.password, 6)

    const createOrUpdate: Prisma.UserCreateInput = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: hashedPassword,
      phone: user.phone,
    }

    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: createOrUpdate,
      update: createOrUpdate,
    })
  }
}
