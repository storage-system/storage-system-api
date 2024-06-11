import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

export const createCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
})

export class CreateCategoryDTO extends createZodDto(createCategoryBodySchema) {}