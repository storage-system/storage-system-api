import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { StockOperation } from '@/domain/enterprise/product/stock-operation'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'

import { ProductsRepository } from '../../../../enterprise/product/products-repository'

export interface UpdateProductStockUseCaseRequest {
  productId: string
  quantity: number
  operation: StockOperation
}

@Injectable()
export class UpdateProductStockUseCase {
  constructor(private productsRepository: ProductsRepository) {}

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
  }
}
