import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createStyleBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean().optional().default(false),
  backgroundColor: z.string(),
  textColor: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  tertiaryColor: z.string(),
})

export class CreateStyleDTO extends createZodDto(createStyleBodySchema) {}
