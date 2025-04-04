import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { GetConfigurationOutput } from './get-configuration-output'

export interface GetConfigurationUseCaseRequest {
  configurationId: string
}

export type GetConfigurationUseCaseResponse = GetConfigurationOutput

@Injectable()
export class GetConfigurationUseCase {
  constructor(private configurationRepository: ConfigurationRepository) {}

  async execute(
    anInput: GetConfigurationUseCaseRequest,
  ): Promise<GetConfigurationUseCaseResponse> {
    const configuration = await this.configurationRepository.findById(
      anInput.configurationId,
    )

    if (!configuration) {
      throw ResourceNotFoundException.with(
        'Configuração',
        new UniqueEntityID(anInput.configurationId),
      )
    }

    return GetConfigurationOutput.fromAggregate(configuration)
  }
}
