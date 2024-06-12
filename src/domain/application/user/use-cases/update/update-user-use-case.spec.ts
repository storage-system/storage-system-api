import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UpdateUserUseCase } from "./update-user-use-case";
import { makeUser } from "test/factories/make-user";
import { faker } from "@faker-js/faker";

let repository: InMemoryUsersRepository
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

    const newUser = makeUser({}, new UniqueEntityID(userId))

    await repository.create(newUser)

    const updateUser = {
      userId,
      name: 'user-02',
    }

    await useCase.execute(updateUser)

    expect(repository.items[0]).toMatchObject({
      name: updateUser.name,
    })
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