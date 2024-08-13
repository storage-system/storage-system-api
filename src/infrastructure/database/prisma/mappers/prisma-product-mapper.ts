import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product, StatusProduct } from '@/domain/enterprise/product/product';
import { Slug } from '@/domain/enterprise/slug/slug';
import { Prisma, Product as PrismaProduct } from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create({
      name: raw.name,
      slug: Slug.create(raw.slug),
      description: raw.description,
      originalPrice: raw.originalPrice,
      finalPrice: raw.finalPrice,
      discountPercentage: raw.discountPercentage,
      quantityInStock: raw.quantityInStock,
      manufactureDate: raw.manufactureDate ?? undefined,
      validityInDays: raw.validityInDays,
      unitOfMeasure: raw.unitOfMeasure,
      weight: raw.weight,
      dimensions: {
        height: raw.dimensions_height,
        width: raw.dimensions_width,
        depth: raw.dimensions_depth
      },
      manufacturer: raw.manufacturer ?? undefined,
      batch: raw.batch ?? undefined,
      status: raw.status as StatusProduct,
      companyId: new UniqueEntityID(raw.companyId),
      categoryIds: [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    })
  }

  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug.value,
      description: product.description,
      originalPrice: product.originalPrice,
      finalPrice: product.finalPrice,
      discountPercentage: product.discountPercentage,
      quantityInStock: product.quantityInStock,
      manufactureDate: product.manufactureDate,
      validityInDays: product.validityInDays,
      unitOfMeasure: product.unitOfMeasure,
      weight: product.weight,
      dimensions_depth: product.dimensions?.depth!,
      dimensions_height: product.dimensions?.height!,
      dimensions_width: product.dimensions?.width!,
      manufacturer: product.manufacturer,
      batch: product.batch,
      status: product.status,
      companyId: product.companyId.toString(),
      categories: product.categoryIds ? {
        connect: product.categoryIds.map((categoryId) => ({
          id: categoryId.toString(),
        })),
      } : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    }
  }
}