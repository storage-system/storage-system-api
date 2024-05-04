import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"
import { AuthenticateCompanyUseCase } from "./authenticate-company-use-case"
import { makeCompany } from "test/factories/make-company"


let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateCompanyUseCase

describe('Authenticate Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateCompanyUseCase(
      inMemoryCompaniesRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a company', async () => {
    const passwordMock = '123456'

    const company = makeCompany({
      email: 'johndoeeletronics@example.com',
      password: await fakeHasher.hash(passwordMock),
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      email: company.email,
      password: passwordMock,
    })

    expect(result.accessToken).toBeTruthy()
    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })
})