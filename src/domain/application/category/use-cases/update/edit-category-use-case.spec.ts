import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { EditCategoryUseCase } from './edit-category-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let repository: InMemoryCategoriesRepository
let useCase: EditCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    repository = new InMemoryCategoriesRepository()
    useCase = new EditCategoryUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to edit a category', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await repository.create(newCategory)

    await useCase.execute({
      companyId: 'company-01',
      categoryId: 'category-01',
      name: 'category-update-01',
      isActive: true,
    })

    expect(repository.items[0]).toMatchObject({
      name: 'category-update-01',
      isActive: true,
    })
  })

  it('should not be able to edit a category that does not exist', async () => {
    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: 'company-01',
      name: 'category-01',
      isActive: true,
    })

    expect(response).rejects.toThrow(`Categoria com ID category-01 não foi encontrado`)
  })

  it('should not be able to edit a category from another company', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await repository.create(newCategory)

    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: 'company-02',
      name: 'category-update-01',
      isActive: true,
    })

    expect(response).rejects.toThrow('Unauthorized')
  })
})
