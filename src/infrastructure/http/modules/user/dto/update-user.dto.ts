import { UserRoles } from "@/domain/enterprise/user/user-types"
import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRoles).optional(),
})


export class UpdateUserDTO extends createZodDto(updateUserBodySchema) { }