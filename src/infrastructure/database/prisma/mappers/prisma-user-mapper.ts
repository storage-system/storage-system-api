import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/enterprise/user/user';
import { UserRole } from '@/domain/enterprise/user/user-types';
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      phone: raw.phone,
      role: raw.role as UserRole,
    }, new UniqueEntityID(raw.id))
  }

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    }
  }
}