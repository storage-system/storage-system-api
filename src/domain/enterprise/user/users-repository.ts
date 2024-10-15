import { Pagination } from '@/core/entities/pagination'
import { User } from '@/domain/enterprise/user/user'
import { Repository } from '@/core/repository'

import { ListUsersCommand } from '../../application/user/use-cases/retrieve/list/list-users-command'

export abstract class UsersRepository extends Repository<User> {
  abstract findAll(params: ListUsersCommand): Promise<Pagination<User>>
  abstract findAllUnpaged(): Promise<User[]>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByIds([ids]: string[]): Promise<User[]>
}
