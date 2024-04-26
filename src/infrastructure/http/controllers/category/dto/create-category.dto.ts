import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

export const createCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
})

export const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)
export type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>