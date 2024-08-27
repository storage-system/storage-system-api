import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user-use-case'
import { makeUser } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { UsersRepository } from '../../../../enterprise/user/users-repository'

let repository: UsersRepository
let useCase: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    useCase = new DeleteUserUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to delete an user', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    const newUser = await makeUser({
      override: {
        id: userId
      },
      repository,
    })

    await repository.create(newUser)

    await useCase.execute({
      userId,
    })

    const userOnDatabase = await repository.findById(newUser.id.toString())

    expect(userOnDatabase).toBeNull()
  })

  it('should not be able to delete an user that does not exist', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    const response = useCase.execute({
      userId,
    })

    expect(response).rejects.toThrow(`Usuário com ID ${userId} não foi encontrado`)
  })
})
