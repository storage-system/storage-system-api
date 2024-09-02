import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

const  updateStyleBodySchema = z.object({
  name: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  tertiaryColor: z.string().optional(),
})

export class UpdateStyleDTO extends createZodDto(updateStyleBodySchema) { }