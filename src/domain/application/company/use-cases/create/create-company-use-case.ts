import NotificationException from '@/core/exception/notification-exception'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { Company } from '@/domain/enterprise/company/company'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

interface CreateCompanyUseCaseRequest {
  name: string
  email: string
  contact: string
  responsible: string
  users: string[] | undefined
}

type CreateCompanyUseCaseResponse = {
  companyId: string
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    name,
    email,
    contact,
    responsible,
    users,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const notification = Notification.create()

    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      notification.appendAnError(new AlreadyExistsError('Company', email))
    }

    const company = Company.create({
      name,
      email,
      contact,
      responsible,
      users: users ?? [],
    })

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar empresa', notification)
    }

    await this.companiesRepository.save(company)

    return {
      companyId: company.id.toString(),
    }
  }
}
