import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { EditCategoryUseCase } from './edit-category-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { fa } from '@faker-js/faker'

let categoriesRepository: InMemoryCategoriesRepository
let companiesRepository: InMemoryCompaniesRepository
let useCase: EditCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new EditCategoryUseCase(categoriesRepository, companiesRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(categoriesRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to edit a category', async () => {
    const company = makeCompany()
    await companiesRepository.create(company)

    const newCategory = makeCategory(
      {
        companyId: company.id
      },
      new UniqueEntityID('category-01'))

    await categoriesRepository.create(newCategory)

    await useCase.execute({
      companyId: company.id.toString(),
      categoryId: 'category-01',
      name: 'category-update-01',
    })

    expect(categoriesRepository.items[0].name).toBe('category-update-01')
  })

  it('should not be able to edit a category that does not exist', async () => {
    const company = makeCompany()
    await companiesRepository.create(company)

    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: company.id.toString(),
      name: 'category-01',
      isActive: true,
    })

    expect(response).rejects.toThrow(`Categoria com ID category-01 não foi encontrado`)
  })

  it('should not be able to edit a category that company does not exist', async () => {
    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: 'company-01',
      name: 'category-01',
      isActive: true,
    })

    expect(response).rejects.toThrow(`Empresa com ID company-01 não foi encontrado`)
  })

  it('should not be able to edit a category from another company', async () => {
    const company = makeCompany()
    const otherCompany = makeCompany()
    await companiesRepository.create(company)
    await companiesRepository.create(otherCompany)

    const newCategory = makeCategory(
      {
        companyId: company.id
      },
      new UniqueEntityID('category-01'))

    await categoriesRepository.create(newCategory)

    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: otherCompany.id.toString(),
      name: 'category-update-01',
      isActive: true,
    })

    expect(response).rejects.toThrow('Unauthorized')
  })
})
