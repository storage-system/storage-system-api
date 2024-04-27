import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { EditCategoryUseCase } from './edit-category-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

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

  it('should not be able to edit a category that does not exist', async () => {
    const result = await sut.execute({
      categoryId: 'category-01',
      companyId: 'company-01',
      name: 'category-01',
      isActive: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a category from another company', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await inMemoryCategoriesRepository.create(newCategory)

    const result = await sut.execute({
      categoryId: 'category-01',
      companyId: 'company-02',
      name: 'category-update-01',
      isActive: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
