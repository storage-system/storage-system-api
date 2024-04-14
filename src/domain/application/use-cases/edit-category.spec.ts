import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { EditCategoryUseCase } from './edit-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new EditCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to edit a category', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await inMemoryCategoriesRepository.create(newCategory)

    await sut.execute({
      companyId: 'company-01',
      categoryId: 'category-01',
      name: 'category-update-01',
      isActive: true,
    })

    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      name: 'category-update-01',
      isActive: true,
    })
  })

  it('should not be able to edit a question from another company', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await inMemoryCategoriesRepository.create(newCategory)

    expect(() => {
      return sut.execute({
        categoryId: 'category-01',
        companyId: 'company-02',
        name: 'category-update-01',
        isActive: true,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
