import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

import { CreateCompanyUseCase } from './create-company-use-case'

let repository: InMemoryCompaniesRepository

let useCase: CreateCompanyUseCase

describe('Create Company', () => {
  beforeEach(() => {
    repository = new InMemoryCompaniesRepository()

    useCase = new CreateCompanyUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(repository).toBeDefined()
  })

  it('should be able to create a new company', async () => {
    const response = await useCase.execute({
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      contact: '99 9999 9999',
      responsible: 'John Doe',
      users: [],
    })

    expect(response).toBeTruthy()
    expect(response).toEqual({
      companyId: repository.items[0].id.toString(),
    })
  })
})
