import { Pagination, PaginationProps } from "@/core/entities/pagination";
import { User } from "@/domain/enterprise/user/user";

export abstract class UsersRepository {
  abstract findAll(params: PaginationProps<User>): Promise<Pagination<User>>
  abstract findAllUnpaged(): Promise<User[]>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(anId: string): Promise<void>
}