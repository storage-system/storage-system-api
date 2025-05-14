import { Prisma, PrismaClient } from '@prisma/client'

import { companies } from './companies'

export async function companySeed(prisma: PrismaClient) {
  for (const company of companies) {
    const create: Prisma.CompanyCreateInput = {
      id: company.id,
      cnpj: company.cnpj,
      contact: company.contact,
      corporateName: company.corporateName,
      tradeName: company.tradeName,
      email: company.email,
      isActive: company.isActive,
      responsible: { connect: { id: company.responsibleId } },
      users: {
        connect: [{ id: company.responsibleId }],
      },
      address: {
        connectOrCreate: {
          where: { id: company.address.id },
          create: {
            id: company.address.id,
            city: company.address.city,
            country: company.address.country,
            state: company.address.state,
            street: company.address.street,
            addressComplement: company.address.addressComplement,
            addressNumber: company.address.addressNumber,
            zipCode: company.address.zipCode,
            neighborhood: company.address.neighborhood,
          },
        },
      },
    }

    const update: Prisma.CompanyUpdateInput = {
      id: company.id,
      contact: company.contact,
      corporateName: company.corporateName,
      tradeName: company.tradeName,
      email: company.email,
      isActive: company.isActive,
      responsible: { connect: { id: company.responsibleId } },
      updatedAt: new Date(),
      address: {
        connectOrCreate: {
          where: { id: company.address.id },
          create: {
            id: company.address.id,
            city: company.address.city,
            country: company.address.country,
            state: company.address.state,
            street: company.address.street,
            addressComplement: company.address.addressComplement,
            addressNumber: company.address.addressNumber,
            zipCode: company.address.zipCode,
            neighborhood: company.address.neighborhood,
          },
        },
      },
    }

    await prisma.company.upsert({
      where: {
        id: company.id,
      },
      create,
      update,
    })
  }
}
