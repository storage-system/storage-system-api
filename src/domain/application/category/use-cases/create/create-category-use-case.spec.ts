import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category-use-case'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { Company } from '@/domain/enterprise/company/company'
import { CategoriesRepository } from '../../categories-repository'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'

let categoriesRepository: CategoriesRepository
let companiesRepository: CompaniesRepository
let useCase: CreateCategoryUseCase

describe('Create Category', () => {
  let company: Company

  beforeEach(async () => {
    categoriesRepository = new InMemoryCategoriesRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new CreateCategoryUseCase(categoriesRepository, companiesRepository)

    company = await makeCompany({
      repository: companiesRepository,
    })
  })

  it('dependencies should be defined', (): void => {
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to create a category', async () => {
    const result = await useCase.execute({
      name: 'category-01',
      companyId: company.id.toString(),
      isActive: true,
    })

    const categoryOnDatabase = await categoriesRepository.findById(result.categoryId)

    expect(result).toBeDefined()
    expect(categoryOnDatabase?.id.toString()).toBe(result.categoryId)
  })

  it('should not be able to create a category if it exist', async () => {
    const categoryMock = {
      name: 'category-01',
      companyId: company.id.toString(),
      isActive: true,
    }

    await useCase.execute(categoryMock)
    const response = useCase.execute(categoryMock)

    expect(response).rejects.toThrow(`Category "${categoryMock.name}" already exists.`)
  })
})