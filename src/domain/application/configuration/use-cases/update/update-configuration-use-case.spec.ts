import { InMemoryConfigurationRepository } from 'test/repositories/in-memory-configuration-repository'
import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeConfiguration } from 'test/factories/make-configuration'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'

import {
  UpdateConfigurationUseCase,
  UpdateConfigurationUseCaseRequest,
} from './update-configuration-use-case'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let configurationRepository: ConfigurationRepository
let useCase: UpdateConfigurationUseCase

describe('Update Configuration Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    companyRepository = new InMemoryCompaniesRepository()
    configurationRepository = new InMemoryConfigurationRepository()

    useCase = new UpdateConfigurationUseCase(configurationRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(configurationRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to update configuration', async () => {
    const user = await makeUser({
      repository: userRepository,
    })

    const company = await makeCompany({
      repository: companyRepository,
    })

    const configuration = await makeConfiguration({
      repository: configurationRepository,
      override: {
        companyId: company.id,
        userId: user.id,
      },
    })

    const configurationId = configuration.id.toString()

    const updateConfigurationProps: UpdateConfigurationUseCaseRequest = {
      configurationId,
      daysBeforeOldStock: 25,
      warningDays: 25,
    }

    await useCase.execute(updateConfigurationProps)

    const configurationOnDatabase =
      await configurationRepository.findById(configurationId)

    expect(configurationOnDatabase?.id.toString()).toBe(configurationId)
    expect(configurationOnDatabase?.daysBeforeOldStock).toBe(
      updateConfigurationProps.daysBeforeOldStock,
    )
    expect(configurationOnDatabase?.warningDays).toBe(
      updateConfigurationProps.warningDays,
    )
  })

  it('should not be able to update a configuration that does not exist', async () => {
    const fakeConfigurationId = 'configuration-id-non-exist'

    const response = useCase.execute({
      configurationId: fakeConfigurationId,
    })

    expect(response).rejects.toThrow(
      `Configuração com ID ${fakeConfigurationId} não foi encontrado`,
    )
  })
})
