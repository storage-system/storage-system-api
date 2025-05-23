import WrongCredentialsException from '@/core/exception/wrong-credentials-exception'
import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '../../enterprise/user/users-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = {
  accessToken: string
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new NotFoundException('Credenciais inválidas')
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsException('Credenciais Inválidas')
    }

    const accessTokenPayload = {
      sub: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyId: user.companyId?.toString(),
      roles: user.roles,
    }

    const accessToken = await this.encrypter.encrypt(accessTokenPayload)

    return {
      accessToken,
    }
  }
}
