import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeUser } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'

import {
  CreateCompanyUseCase,
  CreateCompanyUseCaseRequest,
} from './create-company-use-case'

let companyRespository: CompaniesRepository
let userRepository: UsersRepository

let useCase: CreateCompanyUseCase

describe('Create Company', () => {
  beforeEach(() => {
    companyRespository = new InMemoryCompaniesRepository()
    userRepository = new InMemoryUsersRepository()

    useCase = new CreateCompanyUseCase(companyRespository, userRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(companyRespository).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should be able to create a new company', async () => {
    const user = await makeUser({
      repository: userRepository,
    })

    const companyMock: CreateCompanyUseCaseRequest = {
      corporateName: faker.company.name(),
      tradeName: faker.company.name(),
      cnpj: faker.string.numeric({
        length: 14,
      }),
      email: faker.internet.email(),
      contact: faker.phone.number(),
      responsibleId: user.id.toString(),
      address: {
        city: faker.location.city(),
        country: faker.location.country(),
        state: faker.location.state(),
        street: faker.location.street(),
        complement: faker.lorem.words(),
        neighborhood: faker.location.secondaryAddress(),
        number: faker.location.buildingNumber(),
        zipCode: faker.location.zipCode(),
      },
    }

    const response = await useCase.execute(companyMock)

    const companyOnDatabase = await companyRespository.findById(
      response.companyId,
    )

    expect(response).toBeTruthy()
    expect(response).toEqual({
      companyId: companyOnDatabase?.id.toString(),
    })
    expect(companyOnDatabase?.tradeName).toBe(companyMock.tradeName)
    expect(companyOnDatabase?.responsibleId).toBe(companyMock.responsibleId)
  })
})
