import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Category } from '@/domain/enterprise/category/category'
import { Injectable } from '@nestjs/common'

import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(
    params: PaginationProps<Category>,
  ): Promise<Pagination<Category>> {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          isActive: 'desc',
        },
        {
          slug: 'asc',
        },
      ],
      include: {
        icon: {
          select: {
            id: true,
          },
        },
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
    })

    const totalCategories = await this.prisma.category.count({
      where: {
        deletedAt: null,
      },
    })

    return new Pagination({
      page: params.page,
      perPage: params.perPage,
      items: categories.map(PrismaCategoryMapper.toDomain),
      total: totalCategories,
    })
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    })

    if (!category) return null

    return PrismaCategoryMapper.toDomain(category)
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.create({
      data,
    })
  }

  async update(category: Category) {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(categoryId: string) {
    await this.prisma.category.update({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
