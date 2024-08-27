import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { makeCompany } from "test/factories/make-company";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { RemoveUsersUseCase } from "./remove-users-use-case";
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { CompaniesRepository } from "../../../../enterprise/company/companies-repository";

let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let useCase: RemoveUsersUseCase

describe('Remove Users Use Case', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    useCase = new RemoveUsersUseCase(companiesRepository, usersRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(usersRepository).toBeDefined()
  })

  it('should be able to remove users to the company', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })

    const user = await makeUser({
      override: {
        companyId: company.id
      },
      repository: usersRepository,
    })

    company.assignCompany(user.id.toString())

    const companyId = company.id.toString()

    await useCase.execute({
      companyId,
      userIds: [user.id.toString()]
    })

    const companyOnDatabase = await companiesRepository.findById(companyId)

    expect(companyOnDatabase?.users).toEqual([])
  })
})