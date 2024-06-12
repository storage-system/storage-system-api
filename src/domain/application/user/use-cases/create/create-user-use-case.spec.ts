import { FakeHasher } from "test/cryptography/fake-hasher"
import { CreateUserUseCase } from "./create-user-use-case"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { UserRole } from "@/domain/enterprise/user/user-types"
import { faker } from "@faker-js/faker"
import { makeUser } from "test/factories/make-user"

let repository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let useCase: CreateUserUseCase

describe('Create Company', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    useCase = new CreateUserUseCase(repository, fakeHasher)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(repository).toBeDefined()
    expect(fakeHasher).toBeDefined()
  })

  it('should be able to create a new user', async () => {
    const result = await useCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8
      }),
      phone: faker.phone.number(),
      role: UserRole.MEMBER
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: repository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const passwordMocked = faker.string.alphanumeric({
      length: 8
    })

    const result = await useCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordMocked,
      phone: faker.phone.number(),
      role: UserRole.MEMBER
    })

    const hashedPassword = await fakeHasher.hash(passwordMocked)

    expect(result.isRight()).toBe(true)
    expect(repository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a user that email already exist', async () => {
    const firstUser = makeUser()
    await useCase.execute(firstUser)

    const response = useCase.execute({
      name: faker.person.fullName(),
      email: firstUser.email,
      password: faker.string.alphanumeric({
        length: 8
      }),
      phone: faker.phone.number(),
      role: UserRole.MEMBER
    })

    expect(response).rejects.toThrow('Erro ao criar usuário')
  })
})