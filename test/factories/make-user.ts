import { PrismaUserMapper } from '@/infrastructure/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/enterprise/user/user'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeUser({
  repository,
  override,
}: FactoryProp<
  User,
  Partial<
    UserProps & {
      id: string
    }
  >
> = {}): Promise<User> {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
      ...override,
    },
    new UniqueEntityID(override?.id),
  )

  if (repository) {
    await repository.create(user)
  }

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = await makeUser({ override: data })

    await this.prisma.user.create({
      data: PrismaUserMapper.toPersistence(user),
    })

    return user
  }
}
