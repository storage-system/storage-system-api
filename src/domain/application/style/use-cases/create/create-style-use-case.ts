import { Injectable } from '@nestjs/common'
import { Notification } from '@/core/validation/notification'
import NotificationException from '@/core/exception/notification-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import Error from '@/core/validation/error'
import { ValidationHandler } from '@/core/validation/validation-handler'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { Style } from '@/domain/enterprise/style/style'

export interface CreateStyleUseCaseRequest {
  companyId: string
  name: string
  isActive: boolean,
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
  ) { }

  async execute(anInput: CreateStyleUseCaseRequest): Promise<CreateStyleUseCaseResponse> {
    const notification = Notification.create()

    await this.validateCompany(anInput.companyId, notification)

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar estilização.', notification)
    }

    const style = Style.create({
      ...anInput,
      companyId: new UniqueEntityID(anInput.companyId),
    })

    await this.styleRepository.create(style)

    return {
      styleId: style.id.toString()
    }
  }

  async validateCompany(id: string, aHandler: ValidationHandler) {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      aHandler.appendAnError(
        new Error("Empresa não encontrada.")
      )
    }

    return company
  }
}