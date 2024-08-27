import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { ListUsersUseCase } from './list-users-use-case'
import { makeUser } from 'test/factories/make-user'
import { UsersRepository } from '../../../../../enterprise/user/users-repository'

let repository: UsersRepository
let useCase: ListUsersUseCase

describe('List Users Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryUsersRepository()
    useCase = new ListUsersUseCase(repository)

    await makeUser({
      repository,
    })
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to list users', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(10)
  })

  it('should get an users with 5 items per page', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 5,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(5)
  })

  it('should get an users on page 2', async () => {
    const result = await useCase.execute({
      page: 2,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(0)
    expect(result.total).toBe(1)
    expect(result.page).toBe(2)
    expect(result.perPage).toBe(10)
  })
})
