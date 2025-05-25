import { Prisma, PrismaClient } from '@prisma/client'

import * as companies from './companies.json'

export async function companySeed(prisma: PrismaClient) {
  for (const company of companies) {
    const create: Prisma.CompanyCreateInput = {
      id: company.id,
      cnpj: company.cnpj,
      contact: company.contact,
      corporateName: company.corporate_name,
      tradeName: company.trade_name,
      email: company.email,
      isActive: true,
      responsible: { connect: { id: company.responsible_id } },
      users: {
        connect: [{ id: company.responsible_id }],
      },
      address: {
        connect: { id: company.address_id },
      },
      createdAt: new Date(company.created_at),
    }

    const update: Prisma.CompanyUpdateInput = {
      cnpj: company.cnpj,
      contact: company.contact,
      corporateName: company.corporate_name,
      tradeName: company.trade_name,
      email: company.email,
      isActive: true,
      responsible: { connect: { id: company.responsible_id } },
      updatedAt: new Date(),
      address: {
        connect: { id: company.address_id },
      },
    }

    await prisma.company.upsert({
      where: { id: company.id },
      create,
      update,
    })
  }
}
