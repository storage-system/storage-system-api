import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { GetStyleOutput } from './get-style-output'

export interface CreateStyleUseCaseRequest {
  styleId: string
}

type GetStyleUseCaseResponse = GetStyleOutput

@Injectable()
export class GetStyleUseCase {
  constructor(private styleRepository: StyleRepository) {}

  async execute(
    anInput: CreateStyleUseCaseRequest,
  ): Promise<GetStyleUseCaseResponse> {
    const style = await this.styleRepository.findById(anInput.styleId)

    if (!style) {
      throw ResourceNotFoundException.with(
        'Estilização',
        new UniqueEntityID(anInput.styleId),
      )
    }

    return GetStyleOutput.fromAggregate(style)
  }
}
