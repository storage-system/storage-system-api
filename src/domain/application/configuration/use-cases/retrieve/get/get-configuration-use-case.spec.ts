import { InMemoryConfigurationRepository } from 'test/repositories/in-memory-configuration-repository'
import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeConfiguration } from 'test/factories/make-configuration'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'

import { GetConfigurationUseCase } from './get-configuration-use-case'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let configurationRepository: ConfigurationRepository
let useCase: GetConfigurationUseCase

describe('Get Product Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    companyRepository = new InMemoryCompaniesRepository()
    configurationRepository = new InMemoryConfigurationRepository()

    useCase = new GetConfigurationUseCase(configurationRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(configurationRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve configuration details', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const user = await makeUser({
      repository: userRepository,
    })

    const configuration = await makeConfiguration({
      repository: configurationRepository,
      override: {
        companyId: company.id,
        userId: user.id,
      },
    })

    const result = await useCase.execute({
      configurationId: configuration.id.toString(),
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(configuration.id.toString())
    expect(result.daysBeforeOldStock).toBe(configuration.daysBeforeOldStock)
    expect(result.warningDays).toBe(configuration.warningDays)
    expect(result.reportFrequency).toBe(configuration.reportFrequency)
  })
})
