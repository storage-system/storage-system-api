import { Product, StatusProduct } from '@/domain/enterprise/product/product'
import { EcommerceID } from '@/domain/enterprise/ecommerce/ecommerce'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prisma, Product as PrismaProduct } from '@prisma/client'
import { Slug } from '@/domain/enterprise/slug/slug'

export class PrismaProductMapper {
  static toDomain(
    raw: PrismaProduct & {
      files: {
        id: string
      }[]
    },
  ): Product {
    return Product.create(
      {
        name: raw.name,
        slug: Slug.create(raw.slug),
        description: raw.description,
        fileIds: raw.files.map((item) => item.id),
        originalPrice: raw.originalPrice,
        finalPrice: raw.finalPrice,
        discountPercentage: raw.discountPercentage,
        quantityInStock: raw.quantityInStock,
        minimumStock: raw.minimumStock,
        manufactureDate: raw.manufactureDate,
        dueDate: raw.dueDate,
        validityInDays: raw.validityInDays,
        unitOfMeasure: raw.unitOfMeasure,
        weight: raw.weight,
        dimensions: {
          height: raw.dimensionsHeight,
          width: raw.dimensionsWidth,
          depth: raw.dimensionsDepth,
        },
        manufacturer: raw.manufacturer ?? undefined,
        batch: raw.batch ?? undefined,
        status: raw.status as StatusProduct,
        companyId: new UniqueEntityID(raw.companyId),
        categoryIds: [],
        ecommerceId: raw.ecommerceId
          ? new EcommerceID(raw.ecommerceId)
          : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    )
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
      minimumStock: product.minimumStock,
      manufactureDate: product.manufactureDate,
      dueDate: product.dueDate,
      validityInDays: product.validityInDays,
      unitOfMeasure: product.unitOfMeasure,
      weight: product.weight,
      dimensionsDepth: product.dimensions?.depth!,
      dimensionsHeight: product.dimensions?.height!,
      dimensionsWidth: product.dimensions?.width!,
      manufacturer: product.manufacturer,
      batch: product.batch,
      status: product.status,
      companyId: product.companyId.toString(),
      files:
        product.fileIds && product.fileIds.length > 0
          ? {
              connect: product.fileIds.map((fileId) => ({
                id: fileId,
              })),
            }
          : undefined,
      categories: product.categoryIds
        ? {
            connect: product.categoryIds.map((categoryId) => ({
              id: categoryId.toString(),
            })),
          }
        : undefined,
      ecommerceId: product.ecommerceId ? product.ecommerceId.toString() : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    }
  }
}
