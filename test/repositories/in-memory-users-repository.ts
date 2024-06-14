import { PaginationProps, Pagination } from "@/core/entities/pagination";
import { UsersRepository } from "@/domain/application/user/users-repository";
import { User } from "@/domain/enterprise/user/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findAll({ page, perPage }: PaginationProps<User>): Promise<Pagination<User>> {
    const items = this.items.slice((page - 1) * perPage, page * perPage)

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    })
  }

  async findAllUnpaged(): Promise<User[]> {
    return this.items
  }

  async findByEmail(email: string): Promise<User | null> {
    const user =  this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user =  this.items.find((user) => user.id.toString() === id)

    if (!user) {
      return null
    }
    
    return user
  }

  async findByIds([ids]: string[]): Promise<User[]> {
    const users = this.items.filter((user) => ids.includes(user.id.toString()))

    return users
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(anId: string): Promise<void> {
    const filteredUsers = this.items.filter((user) => user.id.toString() !== anId)

    this.items = filteredUsers
  }
}