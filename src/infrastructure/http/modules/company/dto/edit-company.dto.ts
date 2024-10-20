import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const editCompanyBodySchema = z.object({
  tradeName: z.string().optional(),
  corporateName: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
})

export class EditCompanyDTO extends createZodDto(editCompanyBodySchema) {}
