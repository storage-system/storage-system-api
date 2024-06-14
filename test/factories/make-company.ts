import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company, CompanyProps } from '@/domain/enterprise/company/company'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { PrismaCompanyMapper } from '@/infrastructure/database/prisma/mappers/prisma-company-mapper'

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
      users: [],
      ...override,
    },
    id,
  )

  return company
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCompany(
    data: Partial<CompanyProps> = {},
  ): Promise<Company> {
    const company = makeCompany(data)

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPersistence(company)
    })

    return company
  }
}