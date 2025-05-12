import { StockMovementsRepository } from '@/domain/enterprise/stock-movement/stock-movement-repository'
import { StockMovement } from '@/domain/enterprise/stock-movement/stock-movement'
import { PrismaClient } from '@prisma/client'

export class PrismaStockMovementsRepository
  implements StockMovementsRepository {
  constructor(private prisma: PrismaClient) { }

  async create(movement: StockMovement): Promise<void> {
    await this.prisma.stockMovement.create({
      data: {
        id: movement.id.toString(),
        productId: movement.productId.toString(),
        quantity: movement.quantity,
        operation: movement.operation,
        timestamp: movement.timestamp,
        performedBy: movement.performedBy,
      },
    })
  }
}
