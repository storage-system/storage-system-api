import { StockOperation } from '@/domain/enterprise/stock-movement/stock-operation'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const updateProductStockDTOBodySchema = z.object({
  quantity: z.number(),
  operation: z.nativeEnum(StockOperation),
  performedBy: z.string(),
})

export class UpdateProductStockDTO extends createZodDto(
  updateProductStockDTOBodySchema,
) {}
