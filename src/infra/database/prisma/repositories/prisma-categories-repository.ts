import { PaginationProps, Pagination } from "@/core/entities/pagination";
import { CategoriesRepository } from "@/domain/application/category/categories-repository";
import { Category } from "@/domain/enterprise/category/category";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  findById(id: string): Promise<Category | null> {
    throw new Error("Method not implemented.");
  }

  findAll(params: PaginationProps<Category>): Promise<Pagination<Category>> {
    throw new Error("Method not implemented.");
  }

  create(category: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  save(category: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(category: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
}