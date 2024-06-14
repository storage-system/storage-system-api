import { Pagination } from "@/core/entities/pagination";
import { User } from "@/domain/enterprise/user/user";
import { ListUsersCommand } from "./use-cases/retrieve/list/list-users-command";

export abstract class UsersRepository {
  abstract findAll(params: ListUsersCommand): Promise<Pagination<User>>
  abstract findAllUnpaged(): Promise<User[]>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract findByIds([ids]: string[]): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(anId: string): Promise<void>
}