import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeCompany } from 'test/factories/make-company'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'
import { UpdateCategoryUseCase } from './update-category-use-case'

let categoriesRepository: CategoriesRepository
let companiesRepository: CompaniesRepository
let useCase: UpdateCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new UpdateCategoryUseCase(
      categoriesRepository,
      companiesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(categoriesRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to edit a category', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })

    const newCategory = await makeCategory({
      override: {
        companyId: company.id,
      },
      repository: categoriesRepository,
    })

    await useCase.execute({
      companyId: company.id.toString(),
      categoryId: newCategory.id.toString(),
      name: 'category-update-01',
    })

    const categoryOnDatabase = await categoriesRepository.findById(
      newCategory.id.toString(),
    )

    expect(categoryOnDatabase?.name).toBe('category-update-01')
  })

  it('should not be able to edit a category that does not exist', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })

    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: company.id.toString(),
      name: 'category-01',
      isActive: true,
    })

    expect(response).rejects.toThrow(
      `Categoria com ID category-01 não foi encontrado`,
    )
  })

  it('should not be able to edit a category that company does not exist', async () => {
    const response = useCase.execute({
      categoryId: 'category-01',
      companyId: 'company-01',
      name: 'category-01',
      isActive: true,
    })

    expect(response).rejects.toThrow(
      `Empresa com ID company-01 não foi encontrado`,
    )
  })

  it('should not be able to edit a category from another company', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })
    const otherCompany = await makeCompany({
      repository: companiesRepository,
    })
    await companiesRepository.save(company)
    await companiesRepository.save(otherCompany)

    const newCategory = await makeCategory({
      override: {
        companyId: company.id,
      },
      repository: categoriesRepository,
    })

    const response = useCase.execute({
      categoryId: newCategory.id.toString(),
      companyId: otherCompany.id.toString(),
      name: 'category-update-01',
      isActive: true,
    })

    expect(response).rejects.toThrow('Unauthorized')
  })
})
