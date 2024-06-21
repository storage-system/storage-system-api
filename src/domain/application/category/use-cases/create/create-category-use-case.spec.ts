import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category-use-case'
import { Category } from '@/domain/enterprise/category/category'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

let categoriesRepository: InMemoryCategoriesRepository
let companiesRepository: InMemoryCompaniesRepository
let useCase: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new CreateCategoryUseCase(categoriesRepository, companiesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to create a category', async () => {
    await useCase.execute({
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    })

    expect(categoriesRepository.items[0]).toBeInstanceOf(Category)
  })

  it('should not be able to create a category if it exist', async () => {
    const categoryMock = {
      name: 'category-01',
      companyId: 'company-01',
      isActive: true,
    }

    await useCase.execute(categoryMock)
    const response = useCase.execute(categoryMock)

    expect(response).rejects.toThrow(`Category "${categoryMock.name}" already exists.`)
  })
})