import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../cryptography/hash-generator'
import { CompanyAlreadyExistsError } from '@/core/errors/company-already-exists-error'
import { CompaniesRepository } from '../companies-repository'
import { Company } from '@/domain/enterprise/company/company'

interface CreateCompanyUseCaseRequest {
  name: string
  email: string
  contact: string
  responsible: string
  password: string
}

type CreateCompanyUseCaseResponse = Either<
  CompanyAlreadyExistsError,
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
    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      return left(new CompanyAlreadyExistsError(email))
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

    return right({
      company,
    })
  }
}