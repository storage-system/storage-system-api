import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company, CompanyProps } from '@/domain/enterprise/company/company'

export function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityID,
) {
  const company = Company.create(
    {
      name: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      contact: faker.phone.number(),
      responsible: faker.person.fullName(),
      ...override,
    },
    id,
  )

  return company
}