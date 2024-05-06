import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { FetchCategoriesUseCase } from './fetch-categories-use-case'

let repository: InMemoryCategoriesRepository
let useCase: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryCategoriesRepository()
    useCase = new FetchCategoriesUseCase(repository)

    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01'),
      },
      new UniqueEntityID('category-01'),
    )

    await repository.create(newCategory)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to fetch categories', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.value?.items).toHaveLength(1)
    expect(result.value?.total).toBe(1)
    expect(result.value?.page).toBe(1)
    expect(result.value?.perPage).toBe(10)
  })

  it('should get an occurrence with 5 items per page', async () => {
    const result = await useCase.execute({
      page: 1,
      perPage: 5,
    })

    expect(result).toBeDefined()
    expect(result.value?.items).toHaveLength(1)
    expect(result.value?.total).toBe(1)
    expect(result.value?.page).toBe(1)
    expect(result.value?.perPage).toBe(5)
  })

  it('should get an occurrence on page 2', async () => {
    const result = await useCase.execute({
      page: 2,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.value?.items).toHaveLength(0)
    expect(result.value?.total).toBe(1)
    expect(result.value?.page).toBe(2)
    expect(result.value?.perPage).toBe(10)
  })
})
