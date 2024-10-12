import {
  Configuration,
  ReportFrequency,
} from '@/domain/enterprise/configuration/configuration'
import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import NotificationException from '@/core/exception/notification-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { ValidationHandler } from '@/core/validation/validation-handler'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'
import Error from '@/core/validation/error'

export interface CreateConfigurationUseCaseRequest {
  userId: string
  companyId: string
  daysBeforeOldStock?: number
  warningDays?: number
  emailNotification: boolean
  systemNotification: boolean
  autoDiscardAfterExpiration: boolean
  freeShippingOnOldStock: boolean
  reportFrequency: ReportFrequency
}

export interface CreateConfigurationUseCaseResponse {
  configurationId: string
}

@Injectable()
export class CreateConfigurationUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private configurationRepository: ConfigurationRepository,
  ) {}

  async execute(
    anInput: CreateConfigurationUseCaseRequest,
  ): Promise<CreateConfigurationUseCaseResponse> {
    const notification = Notification.create()

    await this.validateUser(anInput.userId, notification)
    await this.validateCompany(anInput.companyId, notification)

    if (notification.hasErrors()) {
      throw new NotificationException(
        'Erro ao criar configuração.',
        notification,
      )
    }

    const configuration = Configuration.create({
      ...anInput,
      userId: new UniqueEntityID(anInput.userId),
      companyId: new UniqueEntityID(anInput.companyId),
    })

    await this.configurationRepository.create(configuration)

    return {
      configurationId: configuration.id.toString(),
    }
  }

  async validateUser(id: string, aHandler: ValidationHandler) {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      aHandler.appendAnError(new Error('Usuário não encontrado.'))
    }

    return user
  }

  async validateCompany(id: string, aHandler: ValidationHandler) {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      aHandler.appendAnError(new Error('Empresa não encontrada.'))
    }

    return company
  }
}
