import { Injectable } from '@nestjs/common'
import { CompaniesRepository } from '../../companies-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AssignUserUseCaseRequest {
  companyId: string
  userId: string
}

@Injectable()
export class AssignUserUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    companyId,
    userId,
  }: AssignUserUseCaseRequest): Promise<void> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw ResourceNotFoundException.with('Usuário', new UniqueEntityID(userId))
    }

    company.assignCompany(userId)

    await this.companiesRepository.save(company)
  }
}