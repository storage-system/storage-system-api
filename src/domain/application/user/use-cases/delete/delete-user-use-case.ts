import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '../../users-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
  }: DeleteUserUseCaseRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw ResourceNotFoundException.with('Usuário', new UniqueEntityID(userId));
    }

    await this.usersRepository.delete(userId)
  }
}
