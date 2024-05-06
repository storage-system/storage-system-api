import { DeleteCategoryUseCase } from './delete-category-use-case'
import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

let repository: InMemoryCategoriesRepository
let useCase: DeleteCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    repository = new InMemoryCategoriesRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to delete a category', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-01'))

    await repository.create(newCategory)

    await useCase.execute({
      categoryId: 'category-01',
    })

    expect(repository.items).toHaveLength(0)
  })
})
