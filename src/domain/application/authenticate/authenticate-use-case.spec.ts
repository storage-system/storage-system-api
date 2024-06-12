import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { AuthenticateUseCase } from "./authenticate-use-case"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { makeUser } from "test/factories/make-user"

let repository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let useCase: AuthenticateUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    useCase = new AuthenticateUseCase(
      repository,
      fakeHasher,
      encrypter,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(fakeHasher).toBeDefined()
    expect(encrypter).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to authenticate an user', async () => {
    const passwordMock = '123456'

    const user = makeUser({
      email: 'johndoeeletronics@example.com',
      password: await fakeHasher.hash(passwordMock),
    })

    repository.items.push(user)

    const result = await useCase.execute({
      email: user.email,
      password: passwordMock,
    })

    expect(result.accessToken).toBeTruthy()
    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })
})