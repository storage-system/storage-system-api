import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { makeUser } from "test/factories/make-user"
import { makeCompany } from "test/factories/make-company"
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { CompaniesRepository } from "@/domain/enterprise/company/companies-repository"
import { ConfigurationRepository } from "@/domain/enterprise/configuration/configuration-repository"
import { CreateConfigurationUseCase, CreateConfigurationUseCaseRequest } from "./create-configuration-use-case"
import { InMemoryConfigurationRepository } from "test/repositories/in-memory-configuration-repository"
import { ReportFrequency } from "@/domain/enterprise/configuration/configuration"

let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let configurationRepository: ConfigurationRepository

let useCase: CreateConfigurationUseCase

describe('Create Configuration Use Case', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    configurationRepository = new InMemoryConfigurationRepository()

    useCase = new CreateConfigurationUseCase(
      companiesRepository,
      usersRepository,
      configurationRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(companiesRepository).toBeDefined()
    expect(usersRepository).toBeDefined()
    expect(configurationRepository).toBeDefined()
  })

  it('should be able to create a new product', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })
    const company = await makeCompany({
      override: {
        users: [user.id.toString()]
      },
      repository: companiesRepository,
    })

    const configurationMock: CreateConfigurationUseCaseRequest = {
      companyId: company.id.toString(),
      userId: user.id.toString(),
      autoDiscardAfterExpiration: true,
      emailNotification: true,
      freeShippingOnOldStock: true,
      reportFrequency: ReportFrequency.WEEKLY,
      systemNotification: true,
      daysBeforeOldStock: 30,
      warningDays: 15,
    }

    const { configurationId } = await useCase.execute(configurationMock)

    const configurationOnDatabase = await configurationRepository.findById(configurationId)

    expect(configurationOnDatabase?.id.toString()).toBe(configurationId)
    expect(configurationOnDatabase?.companyId).toBe(company.id.toString())
    expect(configurationOnDatabase?.userId).toBe(user.id.toString())
    expect(configurationOnDatabase?.daysBeforeOldStock).toBe(configurationMock.daysBeforeOldStock)
    expect(configurationOnDatabase?.reportFrequency).toBe(configurationMock.reportFrequency)
  })

  it('should not be able to create a configuration that user does not exist', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })

    const userNonExists = 'user-id'

    const configurationMock: CreateConfigurationUseCaseRequest = {
      companyId: company.id.toString(),
      userId: userNonExists,
      autoDiscardAfterExpiration: true,
      emailNotification: true,
      freeShippingOnOldStock: true,
      reportFrequency: ReportFrequency.WEEKLY,
      systemNotification: true,
      daysBeforeOldStock: 30,
      warningDays: 15,
    }

    expect(useCase.execute(configurationMock)).rejects.toThrowError('Erro ao criar configuração.')
  })

  it('should not be able to create a configuration that company does not exist', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })

    const companyNonExists = 'company-id'

    const configurationMock: CreateConfigurationUseCaseRequest = {
      companyId: user.id.toString(),
      userId: companyNonExists,
      autoDiscardAfterExpiration: true,
      emailNotification: true,
      freeShippingOnOldStock: true,
      reportFrequency: ReportFrequency.WEEKLY,
      systemNotification: true,
      daysBeforeOldStock: 30,
      warningDays: 15,
    }

    expect(useCase.execute(configurationMock)).rejects.toThrowError('Erro ao criar configuração.')
  })
})
