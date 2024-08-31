import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'

interface DeleteStyleUseCaseRequest {
  styleId: string
}

@Injectable()
export class DeleteStyleUseCase {
  constructor(
    private styleRepository: StyleRepository,
  ) { }

  async execute({
    styleId
  }: DeleteStyleUseCaseRequest): Promise<void> {
    const style = await this.styleRepository.findById(styleId)

    if (!style) {
      throw ResourceNotFoundException.with(
        'Estilo',
        new UniqueEntityID(styleId)
      );
    }

    style.delete()

    await this.styleRepository.update(style)
  }
}
