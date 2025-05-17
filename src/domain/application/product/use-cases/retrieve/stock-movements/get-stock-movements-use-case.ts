import { StockMovementsRepository } from '@/domain/enterprise/stock-movement/stock-movement-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface GetProductUseCaseRequest {
  companyId: string
}

@Injectable()
export class GetStockMovementsUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private stockMovementsRepository: StockMovementsRepository,
  ) {}

  async execute({ companyId }: GetProductUseCaseRequest): Promise<void> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }

    const movements =
      await this.stockMovementsRepository.getByCompany(companyId)

    return movements
  }
}
