import { Either, left, right } from '@/core/either'
import { CategoriesRepository } from '../categories-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface EditCategoryUseCaseRequest {
  name: string
  categoryId: string
  companyId: string
  isActive: boolean
}

type EditCategoryUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    isActive,
    categoryId,
    companyId,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (companyId !== category.companyId.toString()) {
      return left(new NotAllowedError())
    }

    category.name = name
    category.isActive = isActive

    await this.categoriesRepository.save(category)

    return right({})
  }
}
