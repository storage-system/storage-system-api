import { Either, right } from '@/core/either'
import { CategoriesRepository } from '../../categories-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

type DeleteCategoryUseCaseResponse = Either<ResourceNotFoundError, {}>

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw ResourceNotFoundException.with('Categoria', new UniqueEntityID(categoryId));
    }

    await this.categoriesRepository.delete(category)

    return right({})
  }
}
