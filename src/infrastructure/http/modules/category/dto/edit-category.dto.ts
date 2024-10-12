import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const editCategoryBodySchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
})

export class EditCategoryDTO extends createZodDto(editCategoryBodySchema) {}
