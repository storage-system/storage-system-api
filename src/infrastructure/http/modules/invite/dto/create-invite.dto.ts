import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createInviteBodySchema = z.object({
  email: z.string().email(),
  roles: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
})

export class CreateInviteDTO extends createZodDto(createInviteBodySchema) {}
