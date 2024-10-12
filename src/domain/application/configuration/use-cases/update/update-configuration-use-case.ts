import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface UpdateConfigurationUseCaseRequest {
  configurationId: string
  daysBeforeOldStock?: number
  warningDays?: number
  emailNotification?: boolean
  systemNotification?: boolean
  autoDiscardAfterExpiration?: boolean
  freeShippingOnOldStock?: boolean
  reportFrequency?: ReportFrequency
}

@Injectable()
export class UpdateConfigurationUseCase {
  constructor(private configurationRepository: ConfigurationRepository) {}

  async execute(props: UpdateConfigurationUseCaseRequest) {
    const configuration = await this.configurationRepository.findById(
      props.configurationId,
    )

    if (!configuration) {
      throw ResourceNotFoundException.with(
        'Configuração',
        new UniqueEntityID(props.configurationId),
      )
    }

    configuration.update(props)

    await this.configurationRepository.update(configuration)
  }
}
