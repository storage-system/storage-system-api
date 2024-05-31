import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateSubcategoryUseCase } from './update-subcategory-use-case'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { makeSubcategory } from 'test/factories/make-subcategory'

let subcategoriesRepository: InMemorySubcategoriesRepository
let categoriesRepository: InMemoryCategoriesRepository
let useCase: UpdateSubcategoryUseCase

describe('Update Subcategory', () => {
  beforeEach(() => {
    subcategoriesRepository = new InMemorySubcategoriesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    useCase = new UpdateSubcategoryUseCase(subcategoriesRepository, categoriesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(subcategoriesRepository).toBeDefined()
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to update a subcategory', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    const newSubcategory = makeSubcategory({
      categoryId: newCategory.id
    }, new UniqueEntityID('subcategory-01'))

    await categoriesRepository.create(newCategory)
    await subcategoriesRepository.create(newSubcategory)

    await useCase.execute({
      categoryId: newCategory.id.toString(),
      subcategoryId: newSubcategory.id.toString(),
      name: 'subcategory-update-01',
      isActive: true,
    })

    expect(subcategoriesRepository.items).toHaveLength(1)
    expect(subcategoriesRepository.items[0]).toMatchObject({
      name: 'subcategory-update-01',
      isActive: true,
    })
  })

  it('should not be able to edit a subcategory that does not exist', async () => {
    const newCategory = makeCategory(
      {
        companyId: new UniqueEntityID('company-01')
      },
      new UniqueEntityID('category-01'))

    await categoriesRepository.create(newCategory)

    const response = useCase.execute({
      categoryId: newCategory.id.toString(),
      subcategoryId: 'subcategory-01',
      name: 'Celular',
      isActive: true,
    })

    expect(response).rejects.toThrow(`Subcategoria com ID subcategory-01 não foi encontrado`)
  })

  it('should not be able to edit a subcategory that category does not exist', async () => {
    const newSubcategory = makeSubcategory({
      categoryId: new UniqueEntityID('category-01')
    }, new UniqueEntityID('subcategory-01'))

    await subcategoriesRepository.create(newSubcategory)

    const response = useCase.execute({
      categoryId: newSubcategory.categoryId.toString(),
      subcategoryId: newSubcategory.id.toString(),
      name: newSubcategory.name,
      isActive: true,
    })

    expect(response).rejects.toThrow(`Categoria com ID ${newSubcategory.categoryId} não foi encontrado`)
  })
})
