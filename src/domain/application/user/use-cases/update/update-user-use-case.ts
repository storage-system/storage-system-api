import { UserRoles } from "@/domain/enterprise/user/user-types"
import { Injectable } from "@nestjs/common"
import { UsersRepository } from "../../users-repository"
import ResourceNotFoundException from "@/core/exception/not-found-exception"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  password?: string
  phone?: string
  roles?: UserRoles[]
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ userId, name, email, password, phone, roles }: UpdateUserUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw ResourceNotFoundException.with('Usuário', new UniqueEntityID(userId));
    }

    user.update({
      name,
      email,
      password,
      phone,
      roles,
    })

    await this.usersRepository.save(user)
  }
}