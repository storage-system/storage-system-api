import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const ecommerceSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  productIds: z.array(z.string().uuid()),
  name: z.string().min(1).max(255),
  companyId: z.string().uuid(),
  isActive: z.boolean(),
  previewUrl: z.string().optional(),
  slug: z.object({
    value: z.string(),
  }),
  styles: z
    .array(
      z.object({
        id: z.string().uuid(),
        createdAt: z.date(),
        name: z.string(),
        isActive: z.boolean(),
        backgroundColor: z.string(),
        textColor: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        tertiaryColor: z.string(),
      }),
    )
    .default([]),
  benefits: z.array(
    z.object({
      fileUrl: z.string(),
      text: z.string(),
      description: z.string().optional(),
    }),
  ),
  hero: z
    .array(
      z.object({
        fileId: z.string(),
        text: z.string(),
        fileUrl: z.string(),
      }),
    )
    .default([]),
  updatedAt: z.date().nullable().optional(),
})

export class RetrieveEcommerceDTO extends createZodDto(ecommerceSchema) {}
