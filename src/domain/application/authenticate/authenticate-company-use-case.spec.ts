import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"
import { AuthenticateCompanyUseCase } from "./authenticate-company-use-case"
import { makeCompany } from "test/factories/make-company"

let repository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let useCase: AuthenticateCompanyUseCase

describe('Authenticate Company', () => {
  beforeEach(() => {
    repository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    useCase = new AuthenticateCompanyUseCase(
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

  it('should be able to authenticate a company', async () => {
    const passwordMock = '123456'

    const company = makeCompany({
      email: 'johndoeeletronics@example.com',
      password: await fakeHasher.hash(passwordMock),
    })

    repository.items.push(company)

    const result = await useCase.execute({
      email: company.email,
      password: passwordMock,
    })

    expect(result.accessToken).toBeTruthy()
    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })
})