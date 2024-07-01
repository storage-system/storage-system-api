import { makeUser } from 'test/factories/make-user'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { GetCompanyUseCase } from './get-company-use-case'
import { makeCompany } from 'test/factories/make-company'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'

let companiesRepository: InMemoryCompaniesRepository
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
    const company = makeCompany()
    await companiesRepository.create(company)

    const result = await useCase.execute({
      companyId: company.id.toString()
    })

    expect(result.id).toBe(company.id.toString())
    expect(result.name).toBe(company.name)
    expect(result.users).toEqual([])
  })

  it('should be able to retrieve company details with users', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })

    const company = makeCompany({ users: [user.id.toString()] })
    await companiesRepository.create(company)

    const result = await useCase.execute({
      companyId: company.id.toString()
    })

    expect(result.id).toBe(company.id.toString())
    expect(result.name).toBe(company.name)
    expect(result.users).toHaveLength(1)
    expect(result.users[0].id).toBe(user.id.toString())
    expect(result.users[0].name).toBe(user.name)
  })

  it('should throw error if company not found', async () => {
    const invalidCompanyId = 'invalid-id'

    const response = useCase.execute({ companyId: invalidCompanyId })

    expect(response).rejects.toThrow(`Empresa com ID invalid-id não foi encontrado`)
  })
})
