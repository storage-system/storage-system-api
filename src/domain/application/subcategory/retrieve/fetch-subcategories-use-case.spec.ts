import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { FetchSubcategoriesUseCase } from './fetch-subcategories-use-case'
import { makeSubcategory } from 'test/factories/make-subcategory'

let repository: InMemorySubcategoriesRepository
let useCase: FetchSubcategoriesUseCase

describe('Fetch Subcategories Use Case', () => {
  beforeEach(async () => {
    repository = new InMemorySubcategoriesRepository()
    useCase = new FetchSubcategoriesUseCase(repository)

    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01'),
      },
      new UniqueEntityID('category-01'),
    )

    const newSubcategory = makeSubcategory(
      {
        categoryId: new UniqueEntityID(newCategory.id.toString()),
      },
      new UniqueEntityID('subcategory-01'),
    )

    await repository.create(newSubcategory)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to fetch subcategories', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(10)
  })

  it('should get an subcategories with 5 items per page', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 5,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(5)
  })

  it('should get an subcategories on page 2', async () => {
    const result = await useCase.execute({
      page: 2,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(0)
    expect(result.total).toBe(1)
    expect(result.page).toBe(2)
    expect(result.perPage).toBe(10)
  })
})
