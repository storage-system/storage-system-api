import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { makeCompany } from "test/factories/make-company";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { RemoveUsersUseCase } from "./remove-users-use-case";

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
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
    const company = makeCompany()
    await companiesRepository.create(company)

    const user = makeUser({
      companyId: company.id
    })

    company.assignCompany(user.id.toString())

    await usersRepository.create(user)

    await useCase.execute({
      companyId: company.id.toString(),
      userIds: [user.id.toString()]
    })

    expect(companiesRepository.items[0].users).toEqual([])
  })
})