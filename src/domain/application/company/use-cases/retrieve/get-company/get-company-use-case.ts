import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../../enterprise/company/companies-repository'
import { CompanyPresenter } from './company-presenter'

interface GetCompanyUseCaseRequest {
  companyId: string
}

type GetCompanyUseCaseResponse = CompanyPresenter

@Injectable()
export class GetCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    companyId,
  }: GetCompanyUseCaseRequest): Promise<GetCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }

    const user = await this.usersRepository.findById(company.responsibleId)

    if (!user) {
      throw ResourceNotFoundException.with(
        'Responsável',
        new UniqueEntityID(companyId),
      )
    }

    return CompanyPresenter.fromAggregate(company, user)
  }
}
