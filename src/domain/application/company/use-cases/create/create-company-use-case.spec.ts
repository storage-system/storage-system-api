import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

import { CreateCompanyUseCase } from './create-company-use-case'

let repository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher

let useCase: CreateCompanyUseCase

describe('Create Company', () => {
  beforeEach(() => {
    repository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()

    useCase = new CreateCompanyUseCase(repository, fakeHasher)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(repository).toBeDefined()
    expect(fakeHasher).toBeDefined()
  })

  it('should be able to create a new company', async () => {
    const response = await useCase.execute({
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      password: '123456',
      contact: '99 9999 9999',
      responsible: 'John Doe',
      users: [],
    })

    expect(response).toBeTruthy()
    expect(response).toEqual({
      companyId: repository.items[0].id.toString(),
    })
  })

  it('should hash company password upon registration', async () => {
    const response = await useCase.execute({
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      password: '123456',
      contact: '99 9999 9999',
      responsible: 'John Doe',
      users: [],
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(response).toBeTruthy()
    expect(repository.items[0].password).toEqual(hashedPassword)
  })
})
