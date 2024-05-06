import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category-use-case'
import { Category } from '@/domain/enterprise/category/category'

let repository: InMemoryCategoriesRepository
let useCase: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    repository = new InMemoryCategoriesRepository()
    useCase = new CreateCategoryUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to create a category', async () => {
    const result = await useCase.execute({
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.items[0]).toBeInstanceOf(Category)
  })

  it('should not be able to create a category if it exist', async () => {
    const categoryMock = {
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    }

    await useCase.execute(categoryMock)
    const result = await useCase.execute(categoryMock)

    expect(result.isLeft()).toBe(true)
    expect(repository.items).toHaveLength(1)
  })
})