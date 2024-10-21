import { PrismaUserMapper } from '@/infrastructure/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { User, UserID, UserProps } from '@/domain/enterprise/user/user'
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
      ...override,
    },
    new UserID(override?.id),
  )

  if (repository) {
    await repository.save(user)
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
