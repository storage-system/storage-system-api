import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

import { StockOperation } from './stock-operation'
import { ProductID } from '../product/product'
import { CompanyID } from '../company/company'

interface StockMovementProps {
  productId: ProductID
  quantity: number
  operation: StockOperation
  timestamp: Date
  performedBy: string
}

export class StockMovement extends Entity<StockMovementProps> {
  static create(props: StockMovementProps, id?: UniqueEntityID) {
    return new StockMovement(props, id)
  }

  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  get operation() {
    return this.props.operation
  }

  get timestamp() {
    return this.props.timestamp
  }

  get performedBy() {
    return this.props.performedBy
  }
}
