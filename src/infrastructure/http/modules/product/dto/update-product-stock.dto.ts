import { StockOperation } from '@/domain/enterprise/product/stock-operation'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const updateProductStockDTOBodySchema = z.object({
  quantity: z.number(),
  operation: z.nativeEnum(StockOperation),
})

export class UpdateProductStockDTO extends createZodDto(
  updateProductStockDTOBodySchema,
) {}
