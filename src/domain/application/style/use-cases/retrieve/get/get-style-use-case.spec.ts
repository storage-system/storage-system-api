import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeStyle } from 'test/factories/make-style'

import { GetStyleUseCase } from './get-style-use-case'

let styleRepository: StyleRepository
let companyRepository: CompaniesRepository
let useCase: GetStyleUseCase

describe('Get Style Use Case', () => {
  beforeEach(async () => {
    companyRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()

    useCase = new GetStyleUseCase(styleRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(companyRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve style details', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const style = await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
      },
    })

    const result = await useCase.execute({
      styleId: style.id.toString(),
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(style.id.toString())
    expect(result.companyId).toBe(style.companyId)
    expect(result.backgroundColor).toBe(style.backgroundColor)
    expect(result.textColor).toBe(style.textColor)
    expect(result.primaryColor).toBe(style.primaryColor)
    expect(result.secondaryColor).toBe(style.secondaryColor)
    expect(result.tertiaryColor).toBe(style.tertiaryColor)
  })

  it('should throw error if style not found', async () => {
    const invalidStyleId = 'invalid-id'

    const response = useCase.execute({ styleId: invalidStyleId })

    expect(response).rejects.toThrow(
      `Estilização com ID ${invalidStyleId} não foi encontrado`,
    )
  })
})
