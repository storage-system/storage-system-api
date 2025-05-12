import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const retrieveEcommerceByCompanyIdSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  companyId: z.string().uuid(),
  styles: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      isActive: z.boolean(),
      backgroundColor: z.string(),
      textColor: z.string(),
      primaryColor: z.string(),
      secondaryColor: z.string(),
      tertiaryColor: z.string(),
      companyId: z.string().uuid(),
      createdAt: z.string(),
      updatedAt: z.string(),
      deletedAt: z.string().nullable(),
      ecommerceId: z.string().uuid(),
    }),
  ),
})

export class RetrieveEcommerceByCompanyIdDTO extends createZodDto(
  retrieveEcommerceByCompanyIdSchema,
) {}
