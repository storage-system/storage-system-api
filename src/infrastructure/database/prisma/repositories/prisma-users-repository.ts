import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UsersRepository } from "@/domain/application/user/users-repository";
import { PaginationProps, Pagination } from "@/core/entities/pagination";
import { User } from "@/domain/enterprise/user/user";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) { }

  async findAll(params: PaginationProps<User>): Promise<Pagination<User>> {
    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany(({
        where: {
          deletedAt: null,
        },
        take: params.perPage,
        skip: (params.page - 1) * params.perPage,
        orderBy: {
          createdAt: 'desc'
        },
      })),
      this.prisma.user.count({
        where: {
          deletedAt: null,
        }
      })
    ])

    return new Pagination({
      total: count,
      page: params.page,
      perPage: params.perPage,
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

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User): Promise<void> {
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