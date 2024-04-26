import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

export const fetchCategoriesParamsSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10)
})

export const paramsValidationPìpe = new ZodValidationPipe(fetchCategoriesParamsSchema)
export type FetchCategoriesQuerySchema = z.infer<typeof fetchCategoriesParamsSchema>