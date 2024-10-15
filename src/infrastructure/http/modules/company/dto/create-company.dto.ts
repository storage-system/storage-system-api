import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createCompanyBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  responsible: z.string(),
  users: z.array(z.string().uuid()).optional(),
})

export class CreateCompanyDTO extends createZodDto(createCompanyBodySchema) {}
