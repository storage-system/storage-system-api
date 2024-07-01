import { Pagination } from "@/core/entities/pagination";
import { User } from "@/domain/enterprise/user/user";
import { ListUsersCommand } from "./use-cases/retrieve/list/list-users-command";
import { Repository } from "@/core/repository";

export abstract class UsersRepository extends Repository<User> {
  abstract findAll(params: ListUsersCommand): Promise<Pagination<User>>
  abstract findAllUnpaged(): Promise<User[]>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract findByIds([ids]: string[]): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract update(user: User): Promise<void>
  abstract delete(anId: string): Promise<void>
}