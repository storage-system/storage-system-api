import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const editCompanyBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
  responsible: z.string().optional(),
})

export class EditCompanyDTO extends createZodDto(editCompanyBodySchema) {}
