import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { makeCompany } from "test/factories/make-company";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { AssignUserUseCase } from "./assign-user-use-case";
import { makeUser } from "test/factories/make-user";

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let useCase: AssignUserUseCase

describe('Assign User Use Case', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    useCase = new AssignUserUseCase(companiesRepository, usersRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(usersRepository).toBeDefined()
  })

  it('should be able to assign an user to the company', async () => {
    const company = makeCompany()
    await companiesRepository.create(company)

    const user = makeUser({
      companyId: company.id
    })
    await usersRepository.create(user)

    await useCase.execute({
      companyId: company.id.toString(),
      userId: user.id.toString()
    })

    expect(companiesRepository.items[0].users).toContain(user.id.toString())
  })

  it('should not be able to assign an user that company does not exist', async () => {
    const user = makeUser()
    await usersRepository.create(user)

    const response = useCase.execute({
      companyId: 'company-01',
      userId: user.id.toString(),
    })

    expect(response).rejects.toThrow(`Empresa com ID company-01 não foi encontrado`)
  })
})