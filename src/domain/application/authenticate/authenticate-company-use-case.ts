import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { CompaniesRepository } from '../company/companies-repository'

interface AuthenticateCompanyUseCaseRequest {
  email: string
  password: string
}

type AuthenticateCompanyUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) { }

  async execute({
    email,
    password,
  }: AuthenticateCompanyUseCaseRequest): Promise<AuthenticateCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findByEmail(email)

    if (!company) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      company.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: company.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}