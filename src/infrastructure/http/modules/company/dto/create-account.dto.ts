import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  responsible: z.string(),
  password: z.string(),
})

export const createAccountBodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)
export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
