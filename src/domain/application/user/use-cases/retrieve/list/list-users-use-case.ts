import { Pagination, PaginationProps } from '@/core/entities/pagination';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../../enterprise/user/users-repository';
import { UserPresenter } from '@/infrastructure/http/presenters/user-presenter';
import { ListUsersCommand } from './list-users-command';
import { User } from '@/domain/enterprise/user/user';

type ListUsersUseCaseResponse = PaginationProps<UserPresenter>;

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute(query: ListUsersCommand): Promise<ListUsersUseCaseResponse> {
    const { roles } = query;

    if (roles && User.isAdmin(roles)) {
      query.companyId = undefined;
    }

    const users = await this.usersRepository.findAll(query);

    return new Pagination({
      total: users.total,
      items: users.items.map(UserPresenter.toHTTP),
      perPage: users.perPage,
      page: users.page,
    });
  }
}
