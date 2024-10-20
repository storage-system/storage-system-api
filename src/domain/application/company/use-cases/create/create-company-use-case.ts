import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { CompanyAddress } from '@/domain/enterprise/company/company-address'
import NotificationException from '@/core/exception/notification-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { Company } from '@/domain/enterprise/company/company'
import { Notification } from '@/core/validation/notification'
import { UserID } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

export interface AddressProps {
  street: string
  number?: string
  zipCode?: string
  neighborhood?: string
  city: string
  state: string
  country: string
  complement?: string
}

export interface CreateCompanyUseCaseRequest {
  tradeName: string
  corporateName: string
  cnpj: string
  email: string
  contact: string
  address: AddressProps
  responsibleId: string
}

type CreateCompanyUseCaseResponse = {
  companyId: string
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    tradeName,
    corporateName,
    cnpj,
    email,
    contact,
    address,
    responsibleId,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const notification = Notification.create()
    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      throw NotificationException.withAnError(
        new Error(`Empresa com email "${email}" já existe no sistema.`),
      )
    }

    const findResponsible = await this.userRepository.findById(responsibleId)

    if (!findResponsible) {
      throw ResourceNotFoundException.with('Usuário', new UserID(responsibleId))
    }

    const companyAddress = CompanyAddress.create(address)

    const company = Company.create({
      corporateName,
      tradeName,
      cnpj,
      email,
      contact,
      responsibleId,
      address: companyAddress,
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
