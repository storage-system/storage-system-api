import { Prisma, PrismaClient } from '@prisma/client'

import * as addresses from './address.json'

export async function addressSeed(prisma: PrismaClient) {
  for (const address of addresses) {
    const createOrUpdate: Prisma.AddressCreateInput = {
      id: address.id,
      street: address.street,
      zipCode: address.zip_code,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      addressNumber: address.address_number,
      addressComplement: address.address_complement,
    }

    await prisma.address.upsert({
      where: { id: address.id },
      create: createOrUpdate,
      update: createOrUpdate,
    })
  }
}
