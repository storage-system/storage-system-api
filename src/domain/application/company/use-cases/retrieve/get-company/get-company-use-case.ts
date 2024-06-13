import { Injectable } from '@nestjs/common'
import { CompaniesRepository } from '../../../companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/enterprise/company/company'

interface GetCompanyUseCaseRequest {
  companyId: string
}

type GetCompanyUseCaseResponse = {
  company: Company
}


@Injectable()
export class GetCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
  ) { }

  async execute({
    companyId
  }: GetCompanyUseCaseRequest): Promise<GetCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    return {
      company
    }
  }
}
