import {
  Prisma,
  Benefit as PrismaBenefit,
  Ecommerce as PrismaEcommerce,
  Hero as PrismaHero,
  Style as PrismaStyle,
} from '@prisma/client'
import { Benefit, BenefitID } from '@/domain/enterprise/ecommerce/benefit'
import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Hero, HeroID } from '@/domain/enterprise/ecommerce/hero'
import { ProductID } from '@/domain/enterprise/product/product'
import { FileID } from '@/domain/enterprise/file/file'
import { Slug } from '@/domain/enterprise/slug/slug'

import { PrismaStyleMapper } from './prisma-style-mapper'

type PrismaEcommerceWithRelations = PrismaEcommerce & {
  products: string[]
  styles: PrismaStyle[]
  hero: PrismaHero[]
  benefits: PrismaBenefit[]
}

export class PrismaEcommerceMapper {
  static toDomain(raw: PrismaEcommerceWithRelations): Ecommerce {
    return Ecommerce.create(
      {
        name: raw.name,
        companyId: new UniqueEntityID(raw.companyId),
        isActive: raw.isActive,
        slug: Slug.create(raw.slug),
        ecommercePreview: raw.previewImageId
          ? new FileID(raw.previewImageId)
          : undefined,
        hero: raw.hero.map((hero) =>
          Hero.create(
            { text: hero.text, fileId: new FileID(hero.fileId) },
            new HeroID(hero.id),
          ),
        ),
        styles: raw.styles.map((style) => PrismaStyleMapper.toDomain(style)),
        productIds: raw.products.map((product) => new ProductID(product)),
        benefits: raw.benefits.map((benefit) =>
          Benefit.create(
            {
              text: benefit.text,
              description: benefit.description ?? undefined,
              fileId: new FileID(benefit.fileId),
            },
            new BenefitID(benefit.id),
          ),
        ),
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
      previewImage: raw.ecommercePreview
        ? { connect: { id: raw.ecommercePreview.toString() } }
        : undefined,
      company: {
        connect: {
          id: raw.companyId.toString(),
        },
      },
      hero: {
        create: raw.hero.map((hero) => ({
          fileId: hero.fileId.toString(),
          text: hero.text,
        })),
      },
      benefits: {
        create: raw.benefits.map((benefit) => ({
          id: benefit.id.toString(),
          text: benefit.text,
          description: benefit.description,
          fileId: benefit.fileId.toString(),
        })),
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
      previewImage: raw.ecommercePreview
        ? { connect: { id: raw.ecommercePreview.toString() } }
        : undefined,

      hero: {
        delete: raw.heroRemoved.map((hero) => ({
          id: hero.id.toString(),
        })),
        upsert: raw.heroAdded.map((hero) => ({
          where: {
            id: hero.id.toString(),
          },
          update: {
            text: hero.text,
          },
          create: {
            id: hero.id.toString(),
            fileId: hero.fileId.toString(),
            text: hero.text,
          },
        })),
      },
      benefits: {
        connect: raw.benefitsAdded.map((benefit) => ({
          id: benefit.id.toString(),
        })),
        disconnect: raw.benefitsRemoved.map((benefit) => ({
          id: benefit.id.toString(),
        })),
      },
      styles: {
        upsert: raw.stylesAdded.map((style) => ({
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

      updatedAt: raw.updatedAt ?? undefined,
      deletedAt: raw.deletedAt ?? undefined,
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
