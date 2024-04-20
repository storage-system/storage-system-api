import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Category } from '@/domain/enterprise/category/category';
import { Slug } from '@/domain/enterprise/slug/slug';
import { Prisma, Category as PrismaCateogory } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCateogory): Category {
    return Category.create({
      name: raw.name,
      isActive: raw.isActive,
      companyId: new UniqueEntityID(raw.companyId),
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPersistence(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      isActive: category.isActive,
      companyId: category.companyId.toString(),
      slug: category.slug.value,
      createdAt: category.createdAt,
      deletedAt: category.deletedAt,
      updatedAt: category.updatedAt,
    }
  }
}