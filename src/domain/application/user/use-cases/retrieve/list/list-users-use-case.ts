
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../../users-repository'
import { UserPresenter } from '@/infrastructure/http/presenters/user-presenter'

interface ListUsersUseCaseRequest {
  page: number
  perPage: number
}

type ListUsersUseCaseResponse = PaginationProps<UserPresenter>

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
      items: users.items.map(UserPresenter.toHTTP),
      perPage: users.perPage,
      page: users.page,
    })
  }
}
