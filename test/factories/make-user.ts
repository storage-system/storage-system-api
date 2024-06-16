import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/enterprise/user/user'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { PrismaUserMapper } from '@/infrastructure/database/prisma/mappers/prisma-user-mapper'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8
      }),
      phone: faker.phone.number(),
      role: UserRoles.MEMBER,
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaUser(
    data: Partial<UserProps> = {},
  ): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPersistence(user)
    })

    return user
  }
}