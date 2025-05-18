import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const updateProducts = z.array(
  z.object({
    id: z.string().uuid(),
    action: z.enum(['add', 'remove']),
  }),
)

export class UpdateEcommerceProductsDTO extends createZodDto(updateProducts) {}
