import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteCompanyUseCase } from "./delete-company-use-case";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { UserRoles } from "@/domain/enterprise/user/user-types";

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let useCase: DeleteCompanyUseCase

describe('Edit Company', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new DeleteCompanyUseCase(usersRepository, companiesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(usersRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
  })

  it('should be able to edit a company', async () => {
    const newUser = makeUser({
      role: UserRoles.ADMIN
    })
    await usersRepository.create(newUser)

    const newCompany = makeCompany()
    await companiesRepository.create(newCompany)

    await useCase.execute({
      companyId: newCompany.id.toString(),
      userId: newUser.id.toString(),
    })

    expect(companiesRepository.items.length).toBe(0)
  })

  it('should not be able to edit a company that does companyId not exist', async () => {
    const newUser = makeUser({
      role: UserRoles.ADMIN
    })
    await usersRepository.create(newUser)

    const companyId = 'non-exists-company-id-01'

    await expect(useCase.execute({
      companyId,
      userId: newUser.id.toString(),
    }))
      .rejects.toThrowError(`Empresa com ID ${companyId} não foi encontrado`)
  })

  it('should not be able to edit a company that userId does not exist', async () => {
    const newCompany = makeCompany()
    await companiesRepository.create(newCompany)

    const userId = 'non-exists-user-id-01'

    await expect(useCase.execute({
      companyId: newCompany.id.toString(),
      userId,
    }))
      .rejects.toThrowError(`Usuário com ID ${userId} não foi encontrado`)
  })

  it('should not be able to edit a company if the user does not have the necessary permissions', async () => {
    const newUser = makeUser({
      role: UserRoles.MEMBER
    })
    await usersRepository.create(newUser)

    const newCompany = makeCompany()
    await companiesRepository.create(newCompany)

    await expect(useCase.execute({
      companyId: newCompany.id.toString(),
      userId: newUser.id.toString(),
    }))
      .rejects.toThrowError(`User not authorized to delete company`)
  })
})