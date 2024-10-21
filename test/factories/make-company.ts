import { PrismaCompanyMapper } from '@/infrastructure/database/prisma/mappers/prisma-company-mapper'
import {
  Company,
  CompanyID,
  CompanyProps,
} from '@/domain/enterprise/company/company'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
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
      corporateName: faker.company.name(),
      tradeName: `${faker.company.name()} LTDA`,
      cnpj: faker.string.numeric({
        length: 14,
      }),
      email: faker.internet.email(),
      contact: faker.phone.number(),
      responsibleId: override?.responsibleId ?? faker.string.uuid(),
      address: {
        city: faker.location.city(),
        country: faker.location.country(),
        state: faker.location.state({
          abbreviated: true,
        }),
        street: faker.location.street(),
        complement: faker.location.cardinalDirection(),
        neighborhood: faker.location.secondaryAddress(),
        number: faker.location.buildingNumber(),
        zipCode: faker.location.zipCode(),
      },
      ...override,
    },
    new CompanyID(override?.id),
  )

  if (repository) {
    await repository.save(company)
  }

  return company
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
    const company = await makeCompany({
      override: {
        ...data,
      },
    })

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPersistence(company),
      select: {
        responsibleId: true,
      },
    })

    return company
  }
}
