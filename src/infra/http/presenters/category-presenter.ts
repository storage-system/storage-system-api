import { Category } from "@/domain/enterprise/category/category";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      name: category.name,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}