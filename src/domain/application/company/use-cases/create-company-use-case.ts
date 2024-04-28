import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../cryptography/hash-generator'
import { CompanyAlreadyExistsError } from '@/core/errors/company-already-exists-error'
import { CompaniesRepository } from '../companies-repository'
import { Company } from '@/domain/enterprise/company/company'
import { Notification } from '@/core/validation/notification'
import NotificationException from '@/core/exception/notification-exception'

interface CreateCompanyUseCaseRequest {
  name: string
  email: string
  contact: string
  responsible: string
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
    password,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const notification = Notification.create()

    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      notification.appendAnError(new CompanyAlreadyExistsError(email))
      return left(notification)
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const company = Company.create({
      name,
      email,
      contact,
      responsible,
      password: hashedPassword,
    })

    await this.companiesRepository.create(company)

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar empresa', notification)
    }

    return right({
      company,
    })
  }
}