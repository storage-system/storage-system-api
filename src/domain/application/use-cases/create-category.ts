import { Category } from '@/domain/enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateCategoryUseCaseRequest {
  name: string
  companyId: string
  isActive: boolean
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async exucute({
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

    return {
      category,
    }
  }
}
