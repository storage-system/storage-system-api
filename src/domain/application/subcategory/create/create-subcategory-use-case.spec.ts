import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateSubcategoryUseCase } from './create-subcategory-use-case'
import { InMemorySubcategoriesRepository } from 'test/repositories/in-memory-subcategories-repository'
import { makeCategory } from 'test/factories/make-category'
import { Subcategory } from '@/domain/enterprise/subcategory/subcategory'

let subcategoriesRepository: InMemorySubcategoriesRepository
let categoriesRepository: InMemoryCategoriesRepository
let useCase: CreateSubcategoryUseCase

describe('Create Subcategory', () => {
  beforeEach(() => {
    subcategoriesRepository = new InMemorySubcategoriesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    useCase = new CreateSubcategoryUseCase(
      categoriesRepository,
      subcategoriesRepository
    )
  })

  it('dependencies should be defined', (): void => {
    expect(subcategoriesRepository).toBeDefined()
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to create a subcategory', async () => {
    const category = makeCategory()
    await categoriesRepository.create(category)

    await useCase.execute({
      name: 'subcategory-01',
      categoryId: category.id.toString(),
      isActive: true,
    })

    expect(subcategoriesRepository.items[0]).toBeInstanceOf(Subcategory)
  })

  it('should not be able to create a subcategory if it exists', async () => {
    const category = makeCategory()
    await categoriesRepository.create(category)

    const subcategoryMock = {
      name: 'subcategory-01',
      categoryId: category.id.toString(),
      isActive: true,
    }

    await useCase.execute(subcategoryMock)

    await expect(useCase.execute(subcategoryMock))
      .rejects.toThrow(`A subcategoria ${subcategoryMock.name} já existe.`)
  })

  it('should not be able to create a subcategory if the category does not exist', async () => {
    const subcategoryMock = {
      name: 'subcategory-01',
      categoryId: 'non-existing-category-id',
      isActive: true,
    }

    await expect(useCase.execute(subcategoryMock))
      .rejects.toThrow(`Categoria não encontrada.`)
  })
})
