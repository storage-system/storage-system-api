import { FakeHasher } from "test/cryptography/fake-hasher"
import { CreateCompanyUseCase } from "./create-company"
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher

let sut: CreateCompanyUseCase

describe('Create Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateCompanyUseCase(inMemoryCompaniesRepository, fakeHasher)
  })

  it('should be able to create a new company', async () => {
    const result = await sut.execute({
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      password: '123456',
      contact: '99 9999 9999',
      responsible: 'John Doe'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      company: inMemoryCompaniesRepository.items[0],
    })
  })

  it('should hash company password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      password: '123456',
      contact: '99 9999 9999',
      responsible: 'John Doe'
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0].password).toEqual(hashedPassword)
  })
})