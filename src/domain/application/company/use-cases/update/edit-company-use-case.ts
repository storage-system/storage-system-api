import { Either, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CompaniesRepository } from '../../companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditCompanyUseCaseRequest {
  name: string | undefined
  email: string | undefined
  contact: string | undefined
  responsible: string | undefined
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
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
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
