import { Category as PrismaCategory, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/category/category'
import { FileID } from '@/domain/enterprise/file/file'
import { Slug } from '@/domain/enterprise/slug/slug'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        isActive: raw.isActive,
        companyId: new UniqueEntityID(raw.companyId),
        icon: raw.iconId ? new FileID(raw.iconId) : undefined,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        deletedAt: raw.deletedAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    category: Category,
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      isActive: category.isActive,
      companyId: category.companyId.toString(),
      iconId: category.icon?.toString() ?? undefined,
      slug: category.slug.value,
      createdAt: category.createdAt,
      deletedAt: category.deletedAt,
      updatedAt: category.updatedAt,
    }
  }
}
