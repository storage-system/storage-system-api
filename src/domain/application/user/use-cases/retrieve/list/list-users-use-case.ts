
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../../users-repository'
import { User } from '@/domain/enterprise/user/user'

interface ListUsersUseCaseRequest {
  page: number
  perPage: number
}

type ListUsersUseCaseResponse = PaginationProps<User>

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    page,
    perPage,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findAll({
      page,
      perPage,
    })

    return new Pagination({
      total: users.total,
      items: users.items,
      perPage: users.perPage,
      page: users.page,
    })
  }
}
