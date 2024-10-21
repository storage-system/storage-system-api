import { PrismaCategoryMapper } from '@/infrastructure/database/prisma/mappers/prisma-category-mapper'
import {
  Category,
  CategoryID,
  CategoryProps,
} from '@/domain/enterprise/category/category'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { CompanyID } from '@/domain/enterprise/company/company'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeCategory({
  repository,
  override,
}: FactoryProp<
  Category,
  Partial<
    CategoryProps & {
      id: string
    }
  >
> = {}): Promise<Category> {
  const category = Category.create(
    {
      name: faker.commerce.department(),
      isActive: true,
      companyId: new CompanyID(),
      ...override,
    },
    new CategoryID(override?.id),
  )

  if (repository) {
    await repository.save(category)
  }

  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = await makeCategory({
      override: data,
    })

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPersistence(category),
    })

    return category
  }
}
