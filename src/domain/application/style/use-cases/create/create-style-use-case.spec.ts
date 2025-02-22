import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeUser, UserFactory } from 'test/factories/make-user'
import { makeCompany } from 'test/factories/make-company'
import { User } from '@/domain/enterprise/user/user'
import { faker } from '@faker-js/faker'

import {
  CreateStyleUseCase,
  CreateStyleUseCaseRequest,
} from './create-style-use-case'

let companiesRepository: CompaniesRepository
let styleRepository: StyleRepository
let usersRepository: UsersRepository

let useCase: CreateStyleUseCase

let currentUser: User

describe('Create Style Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()
    usersRepository = new InMemoryUsersRepository()

    useCase = new CreateStyleUseCase(companiesRepository, styleRepository)

    currentUser = await makeUser({ repository: usersRepository })
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(companiesRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
  })

  it('should be able to create a new style', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })
    const styleMock: CreateStyleUseCaseRequest = {
      currentUser,
      name: 'Style 1',
      isActive: false,
      backgroundColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
    }

    const { styleId } = await useCase.execute(styleMock)

    const styleOnDatabase = await styleRepository.findById(styleId)

    expect(styleOnDatabase?.id.toString()).toBe(styleId)
    expect(styleOnDatabase?.companyId).toBe(company.id.toString())
    expect(styleOnDatabase?.backgroundColor).toBe(styleMock.backgroundColor)
    expect(styleOnDatabase?.primaryColor).toBe(styleMock.primaryColor)
    expect(styleOnDatabase?.secondaryColor).toBe(styleMock.secondaryColor)
    expect(styleOnDatabase?.tertiaryColor).toBe(styleMock.tertiaryColor)
    expect(styleOnDatabase?.textColor).toBe(styleMock.textColor)
  })

  it('should not be able to create a style that company does not exist', async () => {
    const styleMock: CreateStyleUseCaseRequest = {
      currentUser,
      name: 'Style 1',
      isActive: false,
      backgroundColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
    }

    expect(useCase.execute(styleMock)).rejects.toThrowError(
      'Erro ao criar estilização.',
    )
  })
})
