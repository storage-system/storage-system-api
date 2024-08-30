import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'

export interface UpdateStyleUseCaseRequest {
  styleId: string
  name?: string
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
}

@Injectable()
export class UpdateStyleUseCase {
  constructor(private styleRepository: StyleRepository) { }

  async execute(props: UpdateStyleUseCaseRequest) {
    const style = await this.styleRepository.findById(props.styleId)

    if (!style) {
      throw ResourceNotFoundException.with(
        'Estilo',
        new UniqueEntityID(props.styleId)
      );
    }

    style.update(props)

    await this.styleRepository.update(style)
  }
}
