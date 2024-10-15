import { PrismaCompanyMapper } from '@/infrastructure/database/prisma/mappers/prisma-company-mapper'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { Company, CompanyProps } from '@/domain/enterprise/company/company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeCompany({
  repository,
  override,
}: FactoryProp<
  Company,
  Partial<
    CompanyProps & {
      id: string
    }
  >
> = {}): Promise<Company> {
  const company = Company.create(
    {
      name: faker.company.name(),
      email: faker.internet.email(),
      contact: faker.phone.number(),
      responsible: faker.person.fullName(),
      users: [],
      ...override,
    },
    new UniqueEntityID(override?.id),
  )

  if (repository) {
    await repository.create(company)
  }

  return company
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
    const company = await makeCompany({
      override: data,
    })

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPersistence(company),
    })

    return company
  }
}
