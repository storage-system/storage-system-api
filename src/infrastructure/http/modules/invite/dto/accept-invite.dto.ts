import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const userAccountBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  phone: z.string(),
})

const acceptInviteBodySchema = z.object({
  inviteId: z.string().uuid(),
  userAccount: userAccountBodySchema,
})

export class AcceptInviteDTO extends createZodDto(acceptInviteBodySchema) {}
