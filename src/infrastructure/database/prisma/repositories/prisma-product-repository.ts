import { ListEcommerceProductsCommand } from '@/domain/application/ecommerce/use-case/retrieve/list-products/list-ecommerce-products-command'
import { ListProductsCommand } from '@/domain/application/product/use-cases/retrieve/list/list-products-command'
import { ProductsRepository } from '@/domain/enterprise/product/products-repository'
import { Product } from '@/domain/enterprise/product/product'
import { Pagination } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

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
        include: {
          files: {
            select: {
              id: true,
            },
          },
        },
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

  async findAllByEcommerceId(params: {
    perPage: number
    page: number
    ecommerceId: string
    categoryId?: string
  }): Promise<Pagination<Product>> {
    const baseWhere: Prisma.ProductWhereInput = {
      deletedAt: null,
      ecommerceId: params.ecommerceId,
      ...(params.categoryId && {
        categories: {
          some: {
            id: params.categoryId,
          },
        },
      }),
    }

    const productsWithMovements = await this.prisma.product.findMany({
      where: baseWhere,
      select: {
        id: true,
        name: true,
        quantityInStock: true,
        stockMovement: {
          select: {
            quantity: true,
            operation: true,
          },
        },
      },
    })

    const productIdsWithStock = productsWithMovements
      .map((product) => {
        const calculatedQuantity = product.stockMovement.reduce(
          (sum, movement) => {
            return movement.operation === 'INCREASE'
              ? sum + movement.quantity
              : sum - movement.quantity
          },
          0,
        )

        const directQuantity = product.quantityInStock

        return {
          id: product.id,
          directQuantity,
          calculatedQuantity,
          hasStock: directQuantity > 0,
        }
      })
      .filter((product) => product.hasStock)
      .map((product) => product.id)

    if (productIdsWithStock.length === 0) {
      return new Pagination<Product>({
        total: 0,
        page: params.page,
        perPage: params.perPage,
        items: [],
      })
    }

    const finalWhere: Prisma.ProductWhereInput = {
      ...baseWhere,
      id: {
        in: productIdsWithStock,
      },
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: finalWhere,
        take: params.perPage,
        skip: (params.page - 1) * params.perPage,
        include: {
          files: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where: finalWhere }),
    ])

    return new Pagination<Product>({
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
      include: {
        files: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
          },
        },
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async save(product: Product): Promise<void> {
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
