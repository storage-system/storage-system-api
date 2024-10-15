import { ListStylesCommand } from '@/domain/application/style/use-cases/retrieve/list/list-styles-command'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { Pagination } from '@/core/entities/pagination'
import { Style } from '@/domain/enterprise/style/style'
import { Injectable } from '@nestjs/common'

import { PrismaStyleMapper } from '../mappers/prisma-style-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStyleRepository implements StyleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll({
    page,
    perPage,
    companyId,
  }: ListStylesCommand): Promise<Pagination<Style>> {
    const [users, count] = await this.prisma.$transaction([
      this.prisma.style.findMany({
        where: {
          deletedAt: null,
          companyId,
        },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.style.count({
        where: {
          deletedAt: null,
          companyId,
        },
      }),
    ])

    return new Pagination({
      total: count,
      page,
      perPage,
      items: users.map(PrismaStyleMapper.toDomain),
    })
  }

  async findActiveStyleByCompanyId(companyId: string): Promise<Style | null> {
    const activeStyle = await this.prisma.style.findFirst({
      where: {
        companyId,
        isActive: true,
      },
    })

    if (!activeStyle) {
      return null
    }

    return PrismaStyleMapper.toDomain(activeStyle)
  }

  async save(record: Style): Promise<void> {
    const data = PrismaStyleMapper.toPersistence(record)

    await this.prisma.style.create({
      data,
    })
  }

  async update(record: Style): Promise<void> {
    const data = PrismaStyleMapper.toPersistence(record)

    await this.prisma.style.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.style.update({
      where: {
        id: anId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async findById(anId: string): Promise<Style | null> {
    const style = await this.prisma.style.findUnique({
      where: {
        id: anId,
      },
    })

    if (!style) {
      return null
    }

    return PrismaStyleMapper.toDomain(style)
  }
}
