import { Either, right } from '@/core/either'
import { Injectable, NotFoundException } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { CompaniesRepository } from '../company/companies-repository'
import WrongCredentialsException from '@/core/exception/wrong-credentials-exception'

interface AuthenticateCompanyUseCaseRequest {
  email: string
  password: string
}

type AuthenticateCompanyUseCaseResponse = {
  accessToken: string
}

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
      throw new NotFoundException('Credenciais inválidas')
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      company.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsException('Credenciais Inválidas')
    }

    const accessToken = await this.encrypter.encrypt({
      sub: company.id.toString(),
      name: company.name,
      email: company.email,
      contact: company.contact,
      responsible: company.responsible,
    })

    return {
      accessToken,
    }
  }
}