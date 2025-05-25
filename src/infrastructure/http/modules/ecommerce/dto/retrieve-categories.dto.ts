import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const categoriesSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isActive: z.boolean().optional(),
  iconId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export class EcommerceCategoriesDTO extends createZodDto(
  z.array(categoriesSchema),
) {}
