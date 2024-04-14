import { Either, left, right } from '@/core/either'
import { CategoriesRepository } from '../../repositories/categories-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

type DeleteCategoryUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    await this.categoriesRepository.delete(category)

    return right({})
  }
}
