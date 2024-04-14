import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { Category } from '@/domain/enterprise/entities/category/category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const { value } = await sut.execute({
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    })

    expect(value?.category.id).toBeTruthy()
    expect(value?.category).toBeInstanceOf(Category)
  })
})