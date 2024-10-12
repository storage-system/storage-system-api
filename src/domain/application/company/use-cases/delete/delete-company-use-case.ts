import NotAuthorizedException from '@/core/exception/not-authorized-exception'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { User } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

interface EditCompanyUseCaseRequest {
  authorId: string
  companyId: string
}

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    authorId,
    companyId,
  }: EditCompanyUseCaseRequest): Promise<void> {
    const notification = Notification.create()

    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }

    const author = await this.usersRepository.findById(authorId)

    if (!author) {
      throw ResourceNotFoundException.with(
        'Usuário',
        new UniqueEntityID(authorId),
      )
    }

    if (!User.canDeleteCompany(author.roles)) {
      throw new NotAuthorizedException(
        'User not authorized to delete company',
        notification,
      )
    }

    await this.companiesRepository.delete(companyId)
  }
}
