import { DeleteCategoryUseCase } from './delete-category'
import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: DeleteCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to delete a category', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-01'))

    await inMemoryCategoriesRepository.create(newCategory)

    await sut.execute({
      categoryId: 'category-01',
    })

    expect(inMemoryCategoriesRepository.items).toHaveLength(0)
  })
})
