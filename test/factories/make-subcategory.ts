import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subcategory, SubcategoryProps } from '@/domain/enterprise/subcategory/subcategory'

export function makeSubcategory(
  override: Partial<SubcategoryProps> = {},
  id?: UniqueEntityID,
) {
  const subcategory = Subcategory.create({
    name: faker.commerce.department(),
    isActive: true,
    categoryId: new UniqueEntityID(),
    ...override,
  },
    id
  )

  return subcategory
}
