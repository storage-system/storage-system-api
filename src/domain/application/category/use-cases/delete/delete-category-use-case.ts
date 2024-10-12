import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ categoryId }: DeleteCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw ResourceNotFoundException.with(
        'Categoria',
        new UniqueEntityID(categoryId),
      )
    }

    await this.categoriesRepository.delete(categoryId)
  }
}
