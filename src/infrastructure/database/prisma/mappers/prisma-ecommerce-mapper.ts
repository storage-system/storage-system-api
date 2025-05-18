import {
  Prisma,
  Ecommerce as PrismaEcommerce,
  Style as PrismaStyle,
} from '@prisma/client'
import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductID } from '@/domain/enterprise/product/product'
import { Slug } from '@/domain/enterprise/slug/slug'

import { PrismaStyleMapper } from './prisma-style-mapper'

type PrismaEcommerceWithRelations = PrismaEcommerce & {
  products: string[]
  styles: PrismaStyle[]
}

export class PrismaEcommerceMapper {
  static toDomain(raw: PrismaEcommerceWithRelations): Ecommerce {
    return Ecommerce.create(
      {
        name: raw.name,
        companyId: new UniqueEntityID(raw.companyId),
        isActive: raw.isActive,
        slug: Slug.create(raw.slug),
        styles: raw.styles.map((style) => PrismaStyleMapper.toDomain(style)),
        productIds: raw.products.map((product) => new ProductID(product)),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
        deletedAt: raw.deletedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(raw: Ecommerce): Prisma.EcommerceCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      slug: raw.slug.value,
      isActive: raw.isActive,
      company: {
        connect: {
          id: raw.companyId.toString(),
        },
      },
      styles: {
        create: raw.styles.map((style) => ({
          name: style.name,
          isActive: style.isActive,
          backgroundColor: style.backgroundColor,
          textColor: style.textColor,
          primaryColor: style.primaryColor,
          secondaryColor: style.secondaryColor,
          tertiaryColor: style.tertiaryColor,
          createdAt: style.createdAt,
          updatedAt: style.updatedAt ?? undefined,
          deletedAt: style.deletedAt ?? undefined,
        })),
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      deletedAt: raw.deletedAt ?? undefined,
    }
  }

  static toPersistenceUpdate(raw: Ecommerce): Prisma.EcommerceUpdateInput {
    return {
      name: raw.name,
      slug: raw.slug.value,
      isActive: raw.isActive,
      styles: {
        upsert: raw.styles.map((style) => ({
          where: {
            id: style.id.toString(),
          },
          update: {
            name: style.name,
            isActive: style.isActive,
            backgroundColor: style.backgroundColor,
            textColor: style.textColor,
            primaryColor: style.primaryColor,
            secondaryColor: style.secondaryColor,
            tertiaryColor: style.tertiaryColor,
            createdAt: style.createdAt,
            updatedAt: style.updatedAt ?? undefined,
            deletedAt: style.deletedAt ?? undefined,
          },
          create: {
            id: style.id.toString(),
            name: style.name,
            isActive: style.isActive,
            backgroundColor: style.backgroundColor,
            textColor: style.textColor,
            primaryColor: style.primaryColor,
            secondaryColor: style.secondaryColor,
            tertiaryColor: style.tertiaryColor,
            createdAt: style.createdAt,
            updatedAt: style.updatedAt ?? undefined,
            deletedAt: style.deletedAt ?? undefined,
          },
        })),
      },
    }
  }

  static toPersistenceAddProduct(
    products: ProductID[],
  ): Prisma.EcommerceUpdateInput {
    return {
      products: {
        connect: products.map((product) => ({
          id: product.toString(),
        })),
      },
    }
  }

  static toPersistenceRemoveProduct(
    products: ProductID[],
  ): Prisma.EcommerceUpdateInput {
    return {
      products: {
        disconnect: products.map((product) => ({
          id: product.toString(),
        })),
      },
    }
  }
}
