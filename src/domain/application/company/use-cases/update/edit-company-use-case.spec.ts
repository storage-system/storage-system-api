import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'

import {
  EditCompanyUseCase,
  EditCompanyUseCaseRequest,
} from './edit-company-use-case'
import { CompaniesRepository } from '../../../../enterprise/company/companies-repository'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let useCase: EditCompanyUseCase

describe('Edit Company', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()

    companyRepository = new InMemoryCompaniesRepository()
    useCase = new EditCompanyUseCase(companyRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(companyRepository).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should be able to edit a company', async () => {
    const user = await makeUser({
      repository: userRepository,
    })

    const newCompany = await makeCompany({
      repository: companyRepository,
      override: {
        responsibleId: user.id.toString(),
      },
    })

    const updateCompany: EditCompanyUseCaseRequest = {
      tradeName: 'company-02',
      email: newCompany.email,
      contact: newCompany.contact,
      companyId: newCompany.id.toString(),
    }

    await useCase.execute(updateCompany)

    const companyOnDatabase = await companyRepository.findById(
      updateCompany.companyId,
    )

    expect(companyOnDatabase?.tradeName).toEqual(updateCompany.tradeName)
  })

  it('should not be able to edit a company that does not exist', async () => {
    const companyId = 'company-id-01'
    const nonExistentCompanyUpdate = {
      companyId,
      name: 'company-01',
      contact: 'contact-01',
      email: 'email-01@example.com',
      responsible: 'responsible-01',
    }

    await expect(
      useCase.execute(nonExistentCompanyUpdate),
    ).rejects.toThrowError(`Empresa com ID ${companyId} não foi encontrado`)
  })
})
