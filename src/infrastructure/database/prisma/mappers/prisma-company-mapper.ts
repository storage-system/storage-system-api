import {
  Company as PrismaCompany,
  Prisma,
  User as PrismaUser,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/enterprise/company/company'
import { Replace } from '@/core/replace'

export class PrismaCompanyMapper {
  static toDomain(
    raw: Replace<
      PrismaCompany,
      {
        users: {
          id: string
        }[]
      }
    >,
  ): Company {
    return Company.create(
      {
        name: raw.name,
        email: raw.email,
        contact: raw.contact,
        responsible: raw.responsible,
        users: raw.users.map((user) => user.id),
        createdAt: raw.createdAt,
        updatedAt: raw.deletedAt ?? undefined,
        deletedAt: raw.deletedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      email: company.email,
      contact: company.contact,
      responsible: company.responsible,
    }
  }
}
