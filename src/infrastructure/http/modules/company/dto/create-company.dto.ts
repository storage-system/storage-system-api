import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const companyAddressSchema = z.object({
  street: z.string(),
  number: z.string().optional(),
  zipCode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string(),
  state: z.string().length(2),
  country: z.string(),
  complement: z.string().optional(),
})

const createCompanyBodySchema = z.object({
  tradeName: z.string(),
  corporateName: z.string(),
  email: z.string().email(),
  cnpj: z.string(),
  contact: z.string(),
  responsibleId: z.string().uuid(),
  address: companyAddressSchema,
})

export class CreateCompanyDTO extends createZodDto(createCompanyBodySchema) {}
