import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { ListStylesUseCase } from './list-styles-use-case'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeStyle } from 'test/factories/make-style'

let companyRepository: CompaniesRepository
let styleRepository: StyleRepository
let useCase: ListStylesUseCase

describe('List Styles Use Case', () => {
  beforeEach(async () => {
    companyRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()
    useCase = new ListStylesUseCase(styleRepository)

    const company = await makeCompany({
      repository: companyRepository,
    })
    await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
      }
    })
  })

  it('dependencies should be defined', (): void => {
    expect(companyRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to list styles', async () => {
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

  it('should get an styles with 5 items per page', async () => {
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

  it('should get an styles on page 2', async () => {
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
