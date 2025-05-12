import { StockMovement } from './stock-movement'

export interface StockMovementsRepository {
  create(movement: StockMovement): Promise<void>
}
