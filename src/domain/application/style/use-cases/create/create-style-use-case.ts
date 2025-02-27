import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import NotificationException from '@/core/exception/notification-exception'
import { ValidationHandler } from '@/core/validation/validation-handler'
import { Notification } from '@/core/validation/notification'
import { Style } from '@/domain/enterprise/style/style'
import { User } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'
import Error from '@/core/validation/error'

export interface CreateStyleUseCaseRequest {
  currentUser: User
  name: string
  isActive: boolean
  backgroundColor: string
  textColor: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
}

export interface CreateStyleUseCaseResponse {
  styleId: string
}

@Injectable()
export class CreateStyleUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private styleRepository: StyleRepository,
  ) {}

  async execute(
    anInput: CreateStyleUseCaseRequest,
  ): Promise<CreateStyleUseCaseResponse> {
    const notification = Notification.create()

    if (!anInput.currentUser.companyId) {
      throw ResourceNotFoundException.withAnError(
        new Error('Usuário não possui uma empresa associada.'),
      )
    }

    await this.validateCompany(
      anInput.currentUser.companyId.toString(),
      notification,
    )

    if (notification.hasErrors()) {
      throw new NotificationException(
        'Erro ao criar estilização.',
        notification,
      )
    }

    const style = Style.create({
      ...anInput,
      companyId: anInput.currentUser.companyId,
    })

    await this.styleRepository.save(style)

    return {
      styleId: style.id.toString(),
    }
  }

  async validateCompany(id: string, aHandler: ValidationHandler) {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      aHandler.appendAnError(new Error('Empresa não encontrada.'))
    }

    return company
  }
}
