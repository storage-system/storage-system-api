import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category, CategoryProps } from '@/domain/enterprise/entities/category'

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
