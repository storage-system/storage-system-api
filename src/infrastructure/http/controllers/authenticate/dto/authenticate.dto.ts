import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe"
import { z } from "zod"

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)
export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>