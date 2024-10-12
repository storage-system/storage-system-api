import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

interface EditCompanyUseCaseRequest {
  name: string | undefined
  email: string | undefined
  contact: string | undefined
  responsible: string | undefined
  companyId: string
}

@Injectable()
export class EditCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    name,
    email,
    contact,
    responsible,
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
      name,
      email,
      responsible,
      contact,
    })

    await this.companiesRepository.update(company)
  }
}
