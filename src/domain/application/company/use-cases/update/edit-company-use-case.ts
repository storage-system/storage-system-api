import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

export interface EditCompanyUseCaseRequest {
  tradeName?: string
  corporateName?: string
  cnpj?: string
  email?: string
  contact?: string
  companyId: string
}

@Injectable()
export class EditCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    tradeName,
    corporateName,
    cnpj,
    email,
    contact,
    companyId,
  }: EditCompanyUseCaseRequest): Promise<void> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }

    company.update({
      corporateName,
      tradeName,
      cnpj,
      email,
      contact,
    })

    await this.companiesRepository.update(company)
  }
}
