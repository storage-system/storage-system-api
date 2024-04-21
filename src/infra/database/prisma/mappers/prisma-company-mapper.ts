import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Company } from '@/domain/enterprise/company/company';
import { Prisma, Company as PrismaCompany } from '@prisma/client'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      contact: raw.contact,
      responsible: raw.responsible,
    }, new UniqueEntityID(raw.id))
  }

  static toPersistence(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      email: company.email,
      password: company.password,
      contact: company.contact,
      responsible: company.responsible,
    }
  }
}