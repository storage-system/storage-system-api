import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'

import { UsersRepository } from '../../../../enterprise/user/users-repository'
import { CreateUserUseCase } from './create-user-use-case'

let repository: UsersRepository
let fakeHasher: FakeHasher

let useCase: CreateUserUseCase

describe('Create User', () => {
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
        length: 8,
      }),
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
    })

    const userOnDatabase = await repository.findById(result.userId)

    expect(result.userId).toBeDefined()
    expect(userOnDatabase).toBeDefined()
  })

  it('should hash user password upon registration', async () => {
    const passwordMocked = faker.string.alphanumeric({
      length: 8,
    })

    const result = await useCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordMocked,
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
    })

    const hashedPassword = await fakeHasher.hash(passwordMocked)

    const userOnDatabase = await repository.findById(result.userId)

    expect(result.userId).toBeDefined()
    expect(userOnDatabase).toBeDefined()
    expect(userOnDatabase?.password).toEqual(hashedPassword)
  })

  it('should not be able to create a user that email already exist', async () => {
    const firstUser = await makeUser()
    await useCase.execute(firstUser)

    const response = useCase.execute({
      name: faker.person.fullName(),
      email: firstUser.email,
      password: faker.string.alphanumeric({
        length: 8,
      }),
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
    })

    expect(response).rejects.toThrow('Erro ao criar usuário')
  })
})
