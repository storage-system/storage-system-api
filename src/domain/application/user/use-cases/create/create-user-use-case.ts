import { HashGenerator } from '@/domain/application/cryptography/hash-generator'
import NotificationException from '@/core/exception/notification-exception'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Notification } from '@/core/validation/notification'
import { User } from '@/domain/enterprise/user/user'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { UsersRepository } from '../../../../enterprise/user/users-repository'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string
  roles: UserRoles[]
}

type CreateUserUseCaseResponse = {
  userId: string
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
    roles,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const notification = Notification.create()

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      notification.appendAnError(new AlreadyExistsError('User', email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      phone,
      roles,
      password: hashedPassword,
    })

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar usuário', notification)
    }

    await this.usersRepository.create(user)

    return {
      userId: user.id.toString(),
    }
  }
}
