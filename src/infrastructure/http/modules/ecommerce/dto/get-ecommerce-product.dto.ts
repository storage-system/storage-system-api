import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const getProductOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),

  originalPrice: z.number(),
  finalPrice: z.number(),
  discountPercentage: z.number(),

  quantityInStock: z.number(),
  minimumStock: z.number(),
  manufactureDate: z.date(),
  dueDate: z.date(),
  validityInDays: z.number(),

  unitOfMeasure: z.string(),
  weight: z.number(),
  dimensions: z
    .object({
      height: z.number(),
      width: z.number(),
      length: z.number(),
    })
    .optional(),

  manufacturer: z.string().optional(),
  batch: z.string().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']),

  productImage: z.string().optional(),
  ecommerceId: z.string().optional(),

  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isActive: z.boolean(),
    }),
  ),

  attachments: z
    .array(
      z.object({
        id: z.string(),
        filename: z.string(),
        type: z.string(),
        url: z.string(),
      }),
    )
    .optional(),

  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export class GetEcommerceProductDTO extends createZodDto(
  getProductOutputSchema,
) {}
