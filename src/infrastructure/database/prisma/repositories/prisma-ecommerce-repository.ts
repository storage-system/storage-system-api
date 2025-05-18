import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'
import { Slug } from '@/domain/enterprise/slug/slug'
import { Injectable } from '@nestjs/common'

import { PrismaEcommerceMapper } from '../mappers/prisma-ecommerce-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEcommerceRepository implements EcommerceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: Slug): Promise<Ecommerce | null> {
    const data = await this.prisma.ecommerce.findUnique({
      where: {
        slug: slug.value,
      },
      include: {
        styles: true,
        products: { select: { id: true } },
      },
    })

    if (!data) {
      return null
    }

    return PrismaEcommerceMapper.toDomain({
      ...data,
      styles: data.styles,
      products: data.products.map((product) => product.id),
    })
  }

  async findById(anId: string): Promise<Ecommerce | null> {
    const data = await this.prisma.ecommerce.findUnique({
      where: {
        id: anId,
      },
      include: {
        styles: true,
        products: { select: { id: true } },
      },
    })

    if (!data) {
      return null
    }

    return PrismaEcommerceMapper.toDomain({
      ...data,
      styles: data.styles,
      products: data.products.map((product) => product.id),
    })
  }

  async findByCompanyId(companyId: string): Promise<Ecommerce | null> {
    const data = await this.prisma.ecommerce.findUnique({
      where: { companyId },
      include: {
        styles: true,
        products: { select: { id: true } },
      },
    })

    if (!data) {
      return null
    }

    return PrismaEcommerceMapper.toDomain({
      ...data,
      styles: data.styles,
      products: data.products.map((product) => product.id),
    })
  }

  async save(record: Ecommerce): Promise<void> {
    const data = PrismaEcommerceMapper.toPersistence(record)

    await this.prisma.ecommerce.create({
      data,
    })
  }

  async update(record: Ecommerce): Promise<void> {
    const data = PrismaEcommerceMapper.toPersistenceUpdate(record)

    await this.prisma.ecommerce.update({
      where: { id: record.id.toString() },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
