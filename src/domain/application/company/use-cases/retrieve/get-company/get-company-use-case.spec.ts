import { makeUser } from 'test/factories/make-user'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { GetCompanyUseCase } from './get-company-use-case'
import { makeCompany } from 'test/factories/make-company'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let useCase: GetCompanyUseCase

describe('List Users By Company Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    useCase = new GetCompanyUseCase(companiesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(companiesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to list users by company', async () => {
    const user = makeUser()
    await usersRepository.create(user)

    const company = makeCompany()
    await companiesRepository.create(company)

    user.assignCompany(company.id)

    console.log("company", company)

    console.log('items', companiesRepository.items)

    const result = await useCase.execute({
      companyId: company.id.toString()
    })

    console.log('result', result)
  })
})
