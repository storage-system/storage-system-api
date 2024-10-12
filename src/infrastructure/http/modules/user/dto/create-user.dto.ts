import { UserRoles } from '@/domain/enterprise/user/user-types'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  roles: z.array(z.nativeEnum(UserRoles)),
})

export class CreateUserDTO extends createZodDto(createUserBodySchema) {}
