import {
  Company as PrismaCompany,
  Address as PrismaAddress,
  Prisma,
} from '@prisma/client'
import { Company, CompanyID } from '@/domain/enterprise/company/company'
import { Replace } from '@/core/replace'

export class PrismaCompanyMapper {
  static toDomain(
    raw: Replace<
      PrismaCompany & {
        address: PrismaAddress
      },
      {
        users: {
          id: string
        }[]
      }
    >,
  ): Company {
    return Company.create(
      {
        tradeName: raw.tradeName,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        email: raw.email,
        contact: raw.contact,
        address: {
          street: raw.address.street,
          city: raw.address.city,
          state: raw.address.state,
          country: raw.address.country,
          zipCode: raw.address.zipCode ?? undefined,
          number: raw.address.addressNumber ?? undefined,
          neighborhood: raw.address.neighborhood ?? undefined,
          complement: raw.address.addressComplement ?? undefined,
        },
        responsibleId: raw.responsibleId,
        createdAt: raw.createdAt,
        updatedAt: raw.deletedAt ?? undefined,
        deletedAt: raw.deletedAt ?? undefined,
      },
      new CompanyID(raw.id),
    )
  }

  static toPersistence(company: Company): Prisma.CompanyCreateInput {
    return {
      id: company.id.toString(),
      tradeName: company.tradeName,
      corporateName: company.corporateName,
      cnpj: company.cnpj,
      email: company.email,
      contact: company.contact,
      responsible: {
        connect: {
          id: company.responsibleId,
        },
      },
      address: {
        create: {
          street: company.address.street,
          addressNumber: company.address.number,
          zipCode: company.address.zipCode,
          neighborhood: company.address.neighborhood,
          city: company.address.city,
          state: company.address.state,
          country: company.address.country,
          addressComplement: company.address.complement,
        },
      },
    }
  }

  static toPersistenceUpdate(company: Company): Prisma.CompanyUpdateInput {
    return {
      id: company.id.toString(),
      tradeName: company.tradeName,
      corporateName: company.corporateName,
      cnpj: company.cnpj,
      email: company.email,
      contact: company.contact,
      responsible: {
        connect: {
          id: company.responsibleId,
        },
      },
      address: {
        update: {
          street: company.address.street,
          addressNumber: company.address.number,
          zipCode: company.address.zipCode,
          neighborhood: company.address.neighborhood,
          city: company.address.city,
          state: company.address.state,
          country: company.address.country,
          addressComplement: company.address.complement,
        },
      },
      updatedAt: company.updatedAt,
    }
  }
}
