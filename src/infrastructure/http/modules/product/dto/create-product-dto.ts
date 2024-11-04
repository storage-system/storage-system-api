import { StatusProduct } from '@/domain/enterprise/product/product'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  fileIds: z.array(z.string().uuid()),
  originalPrice: z.number(),
  finalPrice: z.number(),
  discountPercentage: z.number(),
  quantityInStock: z.number(),
  manufactureDate: z.string().transform((v) => new Date(v)),
  validityInDays: z.number(),
  unitOfMeasure: z.string(),
  weight: z.number(),
  height: z.string(),
  width: z.string(),
  depth: z.string(),
  manufacturer: z.string().optional(),
  batch: z.string().optional(),
  status: z.nativeEnum(StatusProduct),
  companyId: z.string().uuid(),
  categoryIds: z.array(z.string()),
})

export class CreateProductDTO extends createZodDto(createProductBodySchema) {}
