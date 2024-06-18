import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Replace } from '@/core/replace';
import { Company } from '@/domain/enterprise/company/company';
import { Prisma, Company as PrismaCompany, User as PrismaUser } from '@prisma/client'

export class PrismaCompanyMapper {
  static toDomain(
    raw: Replace<
      PrismaCompany,
      {
        users: {
          id: string
        }[];
      }
    >
  ): Company {
    return Company.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      contact: raw.contact,
      responsible: raw.responsible,
      users: raw.users.map((user) => user.id),
      createdAt: raw.createdAt,
      updatedAt: raw.deletedAt ?? undefined,
      deletedAt: raw.deletedAt ?? undefined,
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