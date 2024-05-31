import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { DeleteSubcategoryUseCase } from './delete-subcategory-use-case'
import { makeSubcategory } from 'test/factories/make-subcategory'

let repository: InMemorySubcategoriesRepository
let useCase: DeleteSubcategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    repository = new InMemorySubcategoriesRepository()
    useCase = new DeleteSubcategoryUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to delete a subcategory', async () => {
    const newSubcategory = makeSubcategory({}, new UniqueEntityID('subcategory-01'))

    await repository.create(newSubcategory)

    await useCase.execute({
      subcategoryId: 'subcategory-01',
    })

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete a subcategory that does not exist', async () => {
    const response = useCase.execute({
      subcategoryId: 'subcategory-01',
    })

    expect(response).rejects.toThrow(`Subcategoria com ID subcategory-01 não foi encontrado`)
  })
})
