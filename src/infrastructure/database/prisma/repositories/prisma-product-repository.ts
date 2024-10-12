import { ListProductsCommand } from '@/domain/application/product/use-cases/retrieve/list/list-products-command'
import { ProductsRepository } from '@/domain/enterprise/product/products-repository'
import { Product } from '@/domain/enterprise/product/product'
import { Pagination } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'

import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(params: ListProductsCommand): Promise<Pagination<Product>> {
    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          deletedAt: null,
          companyId: params.companyId,
        },
        take: params.perPage,
        skip: (params.page - 1) * params.perPage,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId: params.companyId,
        },
      }),
    ])

    return new Pagination({
      total,
      page: params.page,
      perPage: params.perPage,
      items: products.map(PrismaProductMapper.toDomain),
    })
  }

  async findById(anId: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: anId,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })
  }

  async update(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.product.update({
      where: {
        id: anId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
