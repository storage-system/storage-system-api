import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/enterprise/user/user'
import { UserRole } from '@/domain/enterprise/user/user-types'

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
      role: UserRole.MEMBER,
      ...override,
    },
    id,
  )

  return user
}
