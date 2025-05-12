import { StockMovementsRepository } from '@/domain/enterprise/stock-movement/stock-movement-repository'
import { StockOperation } from '@/domain/enterprise/stock-movement/stock-operation'
import { StockMovement } from '@/domain/enterprise/stock-movement/stock-movement'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'

import { ProductsRepository } from '../../../../enterprise/product/products-repository'

export interface UpdateProductStockUseCaseRequest {
  productId: string
  quantity: number
  operation: StockOperation
  performedBy: string
}

@Injectable()
export class UpdateProductStockUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockMovementsRepository: StockMovementsRepository,
  ) { }

  async execute(props: UpdateProductStockUseCaseRequest) {
    const notification = Notification.create()

    const product = await this.productsRepository.findById(props.productId)

    if (!product) {
      throw ResourceNotFoundException.with(
        'Produto',
        new UniqueEntityID(props.productId),
      )
    }

    product.adjustStock(props.quantity, props.operation, notification)

    await this.productsRepository.update(product)

    const stockMovement = StockMovement.create({
      productId: product.id,
      quantity: props.quantity,
      operation: props.operation,
      timestamp: new Date(),
      performedBy: props.performedBy ?? 'Sistema',
    })

    await this.stockMovementsRepository.create(stockMovement)
  }
}
