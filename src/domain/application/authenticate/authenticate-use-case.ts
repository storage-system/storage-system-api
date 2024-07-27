import { Injectable, NotFoundException } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import WrongCredentialsException from '@/core/exception/wrong-credentials-exception'
import { UsersRepository } from '../user/users-repository'

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
  ) { }

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
    };

    console.log("accessTokenPayload", accessTokenPayload)

    const accessToken = await this.encrypter.encrypt(accessTokenPayload)

    console.log('accessToken', accessToken)

    return {
      accessToken,
    }
  }
}