import { StatusProduct } from "@/domain/enterprise/product/product"
import { createZodDto } from "nestjs-zod"
import { z } from "nestjs-zod/z"

export const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  originalPrice: z.number(),
  finalPrice: z.number(),
  discountPercentage: z.number(),
  quantityInStock: z.number(),
  manufactureDate: z
    .date()
    .transform((v) => new Date(v))
    .optional(),
  validityInDays: z.number(),
  unitOfMeasure: z.string(),
  weight: z.number(),
  dimensions_height: z.string(),
  dimensions_width: z.string(),
  dimensions_depth: z.string(),
  manufacturer: z.string().optional(),
  batch: z.string().optional(),
  status: z.nativeEnum(StatusProduct),
  companyId: z.string().uuid(),
  categoryIds: z.array(z.string())
})

export class CreateProductDTO extends createZodDto(createProductBodySchema) { }