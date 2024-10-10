import { Category } from "@/domain/enterprise/category/category";
import { Category as PrismaCategory } from "@prisma/client";

export class CategoryPresenter {
  static toHTTP(category: Category): Partial<PrismaCategory> {
    return {
      id: category.id.toString(),
      name: category.name,
      isActive: category.isActive,
      iconId: category.icon?.toString() ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}