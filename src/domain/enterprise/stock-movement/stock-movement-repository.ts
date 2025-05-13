import { Repository } from '@/core/repository'

import { StockMovement } from './stock-movement'

export abstract class StockMovementsRepository extends Repository<StockMovement> {
  abstract getByCompany(companyId: string): Promise<any>
}
