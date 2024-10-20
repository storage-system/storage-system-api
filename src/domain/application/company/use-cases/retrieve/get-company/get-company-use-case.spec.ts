import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'

import { CompaniesRepository } from '../../../../../enterprise/company/companies-repository'
import { GetCompanyUseCase } from './get-company-use-case'

let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let useCase: GetCompanyUseCase

describe('List Users By Company Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    useCase = new GetCompanyUseCase(companiesRepository, usersRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(companiesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve company details without users', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })

    const company = await makeCompany({
      override: {
        responsibleId: user.id.toString(),
      },
      repository: companiesRepository,
    })

    const result = await useCase.execute({
      companyId: company.id.toString(),
    })

    expect(result.id).toBe(company.id.toString())
    expect(result.tradeName).toBe(company.tradeName)
  })

  it('should be able to retrieve company details with users', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })

    const company = await makeCompany({
      override: {
        responsibleId: user.id.toString(),
      },
      repository: companiesRepository,
    })

    const result = await useCase.execute({
      companyId: company.id.toString(),
    })

    expect(result.id).toBe(company.id.toString())
    expect(result.tradeName).toBe(company.tradeName)
  })

  it('should throw error if company not found', async () => {
    const invalidCompanyId = 'invalid-id'

    const response = useCase.execute({ companyId: invalidCompanyId })

    expect(response).rejects.toThrow(
      `Empresa com ID invalid-id não foi encontrado`,
    )
  })
})
