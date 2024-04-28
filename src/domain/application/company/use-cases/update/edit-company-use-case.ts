import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CompaniesRepository } from '../../companies-repository'

interface EditCompanyUseCaseRequest {
  name: string
  email: string
  contact: string
  responsible: string
  companyId: string
}

type EditCompanyUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class EditCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) { }

  async execute({
    name,
    email,
    contact,
    responsible,
    companyId,
  }: EditCompanyUseCaseRequest): Promise<EditCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    company.update({
      name,
      email,
      responsible,
      contact,
    })

    await this.companiesRepository.save(company)

    return right({})
  }
}
