import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category-use-case'
import { Category } from '@/domain/enterprise/category/category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCategoriesRepository.items[0]).toBeInstanceOf(Category)
  })

  it('should not be able to create a category if it exist', async () => {
    const categoryMock = {
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    }

    await sut.execute(categoryMock)
    const result = await sut.execute(categoryMock)

    expect(result.isLeft()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
  })
})