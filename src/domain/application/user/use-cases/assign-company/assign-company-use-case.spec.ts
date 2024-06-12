import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { faker } from "@faker-js/faker";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { AssignCompanyUseCase } from "./assign-company-use-case";
import { makeCompany } from "test/factories/make-company";

let usersRepository: InMemoryUsersRepository
let companiesRepository: InMemoryCompaniesRepository
let useCase: AssignCompanyUseCase

describe('Assign Company', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new AssignCompanyUseCase(usersRepository, companiesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(usersRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
  })

  it('should be able to assign a user to a company ', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })
    const newUser = makeUser({}, new UniqueEntityID(userId))
    await usersRepository.create(newUser)

    const companyId = faker.string.alphanumeric({
      length: 8
    })
    const newCompany = makeCompany({}, new UniqueEntityID(companyId))
    await companiesRepository.create(newCompany)

    await useCase.execute({
      companyId,
      userId,
    })

    expect(usersRepository.items[0].companyId?.toString()).toBe(companyId)
  })

  it('should not be able to assign a user to a company that user does not exist', async () => {
    const companyId = faker.string.alphanumeric({
      length: 8
    })
    const newCompany = makeCompany({}, new UniqueEntityID(companyId))
    await companiesRepository.create(newCompany)

    const response = useCase.execute({
      companyId,
      userId: 'user-non-exist',
    })

    await expect(response)
      .rejects.toThrowError(`Usuário com ID user-non-exist não foi encontrado`)
  })

  it('should not be able to assign a user to a company that company does not exist', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })
    const newUser = makeUser({}, new UniqueEntityID(userId))
    await usersRepository.create(newUser)

    const response = useCase.execute({
      companyId: 'company-non-exist',
      userId,
    })

    await expect(response)
      .rejects.toThrowError(`Empresa com ID company-non-exist não foi encontrado`)
  })
})