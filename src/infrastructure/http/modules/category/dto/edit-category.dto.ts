import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

const editCategoryBodySchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional()
})

export const editCategoryBodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)
export type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>