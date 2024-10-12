import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'

import { DeleteCompanyUseCase } from './delete-company-use-case'

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: UsersRepository
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
    const newUser = await makeUser({
      override: {
        roles: [UserRoles.ADMIN],
      },
      repository: usersRepository,
    })

    const newCompany = await makeCompany({
      repository: companiesRepository,
    })

    await useCase.execute({
      companyId: newCompany.id.toString(),
      authorId: newUser.id.toString(),
    })

    expect(companiesRepository.items.length).toBe(0)
  })

  it('should not be able to edit a company that does companyId not exist', async () => {
    const newUser = await makeUser({
      override: {
        roles: [UserRoles.ADMIN],
      },
      repository: usersRepository,
    })

    const companyId = 'non-exists-company-id-01'

    await expect(
      useCase.execute({
        companyId,
        authorId: newUser.id.toString(),
      }),
    ).rejects.toThrowError(`Empresa com ID ${companyId} não foi encontrado`)
  })

  it('should not be able to edit a company that userId does not exist', async () => {
    const newCompany = await makeCompany({
      repository: companiesRepository,
    })

    const authorId = 'non-exists-user-id-01'

    await expect(
      useCase.execute({
        companyId: newCompany.id.toString(),
        authorId,
      }),
    ).rejects.toThrowError(`Usuário com ID ${authorId} não foi encontrado`)
  })

  it('should not be able to edit a company if the user does not have the necessary permissions', async () => {
    const newUser = await makeUser({
      override: {
        roles: [UserRoles.MEMBER],
      },
      repository: usersRepository,
    })

    const newCompany = await makeCompany({
      repository: companiesRepository,
    })

    await expect(
      useCase.execute({
        companyId: newCompany.id.toString(),
        authorId: newUser.id.toString(),
      }),
    ).rejects.toThrowError(`User not authorized to delete company`)
  })
})
