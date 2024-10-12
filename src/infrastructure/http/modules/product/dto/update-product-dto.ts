import { StatusProduct } from '@/domain/enterprise/product/product'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const updateProductBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  originalPrice: z.number().optional(),
  finalPrice: z.number().optional(),
  discountPercentage: z.number().optional(),
  quantityInStock: z.number().optional(),
  manufactureDate: z
    .string()
    .transform((v) => new Date(v))
    .optional(),
  validityInDays: z.number().optional(),
  unitOfMeasure: z.string().optional(),
  weight: z.number().optional(),
  dimensions_height: z.string().optional(),
  dimensions_width: z.string().optional(),
  dimensions_depth: z.string().optional(),
  manufacturer: z.string().optional(),
  batch: z.string().optional(),
  status: z.nativeEnum(StatusProduct).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export class UpdateProductDTO extends createZodDto(updateProductBodySchema) {}
