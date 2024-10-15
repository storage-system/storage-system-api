import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { GetUserOutput } from './get-user-output'

export interface CreateUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = GetUserOutput

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(
    anInput: CreateUserUseCaseRequest,
  ): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(anInput.userId)

    if (!user) {
      throw ResourceNotFoundException.with(
        'Usuário',
        new UniqueEntityID(anInput.userId),
      )
    }

    return GetUserOutput.fromAggregate(user)
  }
}
