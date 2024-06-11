import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  responsible: z.string(),
  password: z.string(),
})


export class CreateAccountDTO extends createZodDto(createAccountBodySchema) {}