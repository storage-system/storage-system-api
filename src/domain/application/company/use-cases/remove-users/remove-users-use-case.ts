import { Injectable } from '@nestjs/common'
import { CompaniesRepository } from '../../companies-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValidationHandler } from '@/core/validation/validation-handler'
import Error from '@/core/validation/error'
import { Notification } from '@/core/validation/notification'
import NotificationException from '@/core/exception/notification-exception'

interface RemoveUsersUseCaseRequest {
  companyId: string
  userIds: string[]
}

@Injectable()
export class RemoveUsersUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    companyId,
    userIds,
  }: RemoveUsersUseCaseRequest): Promise<void> {
    const notification = Notification.create()

    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    const usersValidation = await Promise.all(
      userIds.map((userId) => this.validateUser(userId, notification))
    )

    if (notification.hasErrors()) {
      throw new NotificationException(
        "Erro ",
        notification
      );
    }

    const users = usersValidation.filter(user => user).map(user => user!.id.toString());

    await this.companiesRepository.removeUsers(companyId, users)
  }

  async validateUser(id: string, aHandler: ValidationHandler) {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      aHandler.appendAnError(
        new Error("Usuário não se encontra no sistema.")
      )
    }

    return user
  }
}