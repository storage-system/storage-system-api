import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const retrieveEcommerceProductsSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantityInStock: z.number(),
  minimumStock: z.number(),
  manufactureDate: z.date(),
  dueDate: z.date(),
  validityInDays: z.number(),
  manufacturer: z.string().optional(),
  batch: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']),
  productImage: z.string().optional(),
  price: z.number(),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export class EcommerceProductsDTO extends createZodDto(
  z.object({
    items: z.array(retrieveEcommerceProductsSchema),
    total: z.number(),
    page: z.number(),
  }),
) {}
