import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'
import { ListCategoriesUseCase } from './list-categories-use-case'

let repository: CategoriesRepository
let useCase: ListCategoriesUseCase

describe('List Categories Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryCategoriesRepository()
    useCase = new ListCategoriesUseCase(repository)

    await makeCategory({
      override: {
        companyId: new UniqueEntityID('company-01'),
      },
      repository,
    })
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
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(10)
  })

  it('should get an category with 5 items per page', async () => {
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

  it('should get an category on page 2', async () => {
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
