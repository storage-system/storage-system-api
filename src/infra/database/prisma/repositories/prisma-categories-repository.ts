import { PaginationProps, Pagination } from "@/core/entities/pagination";
import { CategoriesRepository } from "@/domain/application/category/categories-repository";
import { Category } from "@/domain/enterprise/category/category";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id
      }
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(params: PaginationProps<Category>): Promise<Pagination<Category>> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        slug: 'asc'
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage
    })

    const totalCategories = await this.prisma.category.count()

    return new Pagination({
      page: params.page,
      perPage: params.perPage,
      items: categories.map(PrismaCategoryMapper.toDomain),
      total: totalCategories,
    })
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      }
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.create({
      data,
    })
  }

  async save(category: Category) {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data
    })
  }

  async delete(category: Category) {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.delete({
      where: {
        id: data.id,
      }
    })
  }
}