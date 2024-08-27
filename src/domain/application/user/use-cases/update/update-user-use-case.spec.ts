import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UpdateUserUseCase } from "./update-user-use-case";
import { makeUser } from "test/factories/make-user";
import { faker } from "@faker-js/faker";
import { UsersRepository } from "../../../../enterprise/user/users-repository";

let repository: UsersRepository
let useCase: UpdateUserUseCase

describe('Update User', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    useCase = new UpdateUserUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should be able to edit an user', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    const newUser = await makeUser({
      override: {
        id: userId,
      },
      repository,
    })

    await repository.create(newUser)

    const updateUser = {
      userId,
      name: 'user-02',
    }

    const userOnDatabase = await repository.findById(userId)

    await useCase.execute(updateUser)

    expect(userOnDatabase?.name).toBe(updateUser.name)
  })

  it('should not be able to edit an user that does not exist', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    const nonExistentUserUpdate = {
      userId,
    }

    await expect(useCase.execute(nonExistentUserUpdate))
      .rejects.toThrowError(`Usuário com ID ${userId} não foi encontrado`)
  })
})