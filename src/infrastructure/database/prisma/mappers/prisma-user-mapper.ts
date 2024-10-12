import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Prisma, User as PrismaUser } from '@prisma/client'
import { User } from '@/domain/enterprise/user/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        phone: raw.phone,
        companyId: raw.companyId
          ? new UniqueEntityID(raw.companyId)
          : undefined,
        roles: raw.roles as UserRoles[],
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      companyId: user.companyId?.toString(),
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    }
  }
}
