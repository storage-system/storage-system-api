import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../../cryptography/hash-generator'
import { CompaniesRepository } from '../../companies-repository'
import { Company } from '@/domain/enterprise/company/company'
import { Notification } from '@/core/validation/notification'
import NotificationException from '@/core/exception/notification-exception'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'

interface CreateCompanyUseCaseRequest {
  name: string
  email: string
  contact: string
  responsible: string
  users: string[]
  password: string
}

type CreateCompanyUseCaseResponse = Either<
  Notification,
  {
    company: Company
  }
>

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    contact,
    responsible,
    users,
    password,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const notification = Notification.create()

    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      notification.appendAnError(new AlreadyExistsError('Company', email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const company = Company.create({
      name,
      email,
      contact,
      responsible,
      users,
      password: hashedPassword,
    })

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar empresa', notification)
    }

    await this.companiesRepository.create(company)

    return right({
      company,
    })
  }
}