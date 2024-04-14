import { CategoriesRepository } from '../repositories/categories-repository'

interface EditCategoryUseCaseRequest {
  name: string
  categoryId: string
  companyId: string
  isActive: boolean
}

interface EditCategoryUseCaseResponse { }

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
      throw new Error('Category not found.')
    }

    if (companyId !== category.companyId.toString()) {
      throw new Error('Not allowed.')
    }

    category.name = name
    category.isActive = isActive

    await this.categoriesRepository.save(category)

    return {}
  }
}
