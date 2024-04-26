import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category, CategoryProps } from '@/domain/enterprise/category/category'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { PrismaCategoryMapper } from '@/infrastructure/database/prisma/mappers/prisma-category-mapper'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create({
    name: faker.commerce.department(),
    isActive: true,
    companyId: new UniqueEntityID(),
    ...override,
  },
    id
  )

  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data)

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPersistence(category)
    })

    return category
  }
}