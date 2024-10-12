import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const removeUsersBodySchema = z.object({
  userIds: z.array(z.string()),
})

export class RemoveUsersDTO extends createZodDto(removeUsersBodySchema) {}
