import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UsersRepository } from "@/domain/enterprise/user/users-repository";
import { Pagination } from "@/core/entities/pagination";
import { User } from "@/domain/enterprise/user/user";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { ListUsersCommand } from "@/domain/application/user/use-cases/retrieve/list/list-users-command";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) { }

  async findAll({ page, perPage, companyId }: ListUsersCommand): Promise<Pagination<User>> {
    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          deletedAt: null,
          companyId: companyId,
        },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          createdAt: 'desc'
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          companyId: companyId,
        }
      })
    ])

    return new Pagination({
      total: count,
      page,
      perPage,
      items: users.map(PrismaUserMapper.toDomain)
    })
  }

  async findAllUnpaged(): Promise<User[]> {
    const users = await this.prisma.user.findMany()

    return users.map(PrismaUserMapper.toDomain)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const anUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return anUsers.map((anUser) => PrismaUserMapper.toDomain(anUser))
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user)

    await this.prisma.user.create({
      data,
    })
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: anId,
      },
      data: {
        deletedAt: new Date()
      }
    })
  }
}