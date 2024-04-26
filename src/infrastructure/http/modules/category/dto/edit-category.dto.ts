import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

const editCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean()
})

export const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)
export type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>