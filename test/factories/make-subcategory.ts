import {
  Subcategory,
  SubcategoryProps,
} from '@/domain/enterprise/subcategory/subcategory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeSubcategory(
  override: Partial<SubcategoryProps> = {},
  id?: UniqueEntityID,
) {
  const subcategory = Subcategory.create(
    {
      name: faker.commerce.department(),
      isActive: true,
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return subcategory
}
