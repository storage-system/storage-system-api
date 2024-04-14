import { Category } from '@/domain/enterprise/entities/category/category'
import { CategoriesRepository } from '../../repositories/categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'

interface CreateCategoryUseCaseRequest {
  name: string
  companyId: string
  isActive: boolean
}

type CreateCategoryUseCaseResponse = Either<null, { category: Category }>

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    companyId,
    isActive,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
      isActive,
      companyId: new UniqueEntityID(companyId),
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
