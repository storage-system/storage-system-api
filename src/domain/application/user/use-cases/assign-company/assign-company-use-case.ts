import { Injectable } from "@nestjs/common"
import { UsersRepository } from "../../users-repository"
import ResourceNotFoundException from "@/core/exception/not-found-exception"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { CompaniesRepository } from "@/domain/application/company/companies-repository"

interface AssignCompanyUseCaseRequest {
  userId: string
  companyId: string
}

@Injectable()
export class AssignCompanyUseCase {
  constructor (
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) { }

  async execute({ userId, companyId }: AssignCompanyUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw ResourceNotFoundException.with('Usuário', new UniqueEntityID(userId));
    }

    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    user.assignCompany(new UniqueEntityID(companyId))

    await this.usersRepository.save(user)
  }
}