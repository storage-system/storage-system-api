import { StockMovementsRepository } from '@/domain/enterprise/stock-movement/stock-movement-repository'
import { StockMovement } from '@/domain/enterprise/stock-movement/stock-movement'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStockMovementsRepository
  implements StockMovementsRepository
{
  constructor(private prisma: PrismaService) {}

  async save(movement: StockMovement): Promise<void> {
    await this.prisma.stockMovement.create({
      data: {
        id: movement.id.toString(),
        productId: movement.productId.toString(),
        quantity: movement.quantity,
        operation: movement.operation,
        timestamp: movement.timestamp,
        performedBy: movement.performedBy,
        companyId: movement.companyId.toString(),
      },
    })
  }

  async getByCompany(companyId: string) {
    const movements = await this.prisma.stockMovement.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        operation: true,
        quantity: true,
        performedBy: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        timestamp: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    return movements
  }

  update(record: StockMovement): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(anId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(anId: string): Promise<StockMovement | null> {
    throw new Error('Method not implemented.')
  }
}
