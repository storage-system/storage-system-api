import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCategory } from 'test/factories/make-category'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'
import { DeleteCategoryUseCase } from './delete-category-use-case'

let repository: CategoriesRepository
let useCase: DeleteCategoryUseCase

describe('Delete Category', () => {
  beforeEach(() => {
    repository = new InMemoryCategoriesRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to delete a category', async () => {
    const newCategory = await makeCategory({
      repository,
    })

    await useCase.execute({
      categoryId: newCategory.id.toString(),
    })

    const categoryOnDatabase = await repository.findById(
      newCategory.id.toString(),
    )

    expect(categoryOnDatabase).toBeNull()
  })

  it('should not be able to delete a category that does not exist', async () => {
    const response = useCase.execute({
      categoryId: 'category-01',
    })

    expect(response).rejects.toThrow(
      `Categoria com ID category-01 não foi encontrado`,
    )
  })
})
