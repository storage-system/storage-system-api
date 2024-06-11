import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export class AuthenticateDTO extends createZodDto(authenticateBodySchema) {}