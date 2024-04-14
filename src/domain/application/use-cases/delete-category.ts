import { CategoriesRepository } from '../repositories/categories-repository'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

interface DeleteCategoryUseCaseResponse { }

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

    await this.categoriesRepository.delete(category)

    return {}
  }
}
