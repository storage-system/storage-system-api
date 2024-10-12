import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeStyle } from 'test/factories/make-style'

import {
  UpdateStyleUseCase,
  UpdateStyleUseCaseRequest,
} from './update-style-use-case'

let companyRepository: CompaniesRepository
let styleRepository: StyleRepository
let useCase: UpdateStyleUseCase

describe('Update Style Use Case', () => {
  beforeEach(async () => {
    companyRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()

    useCase = new UpdateStyleUseCase(styleRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(companyRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to update style', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const style = await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
      },
    })

    const styleId = style.id.toString()

    const updateStyleProps: UpdateStyleUseCaseRequest = {
      styleId,
      name: 'updated-name',
      primaryColor: '#222',
    }

    await useCase.execute(updateStyleProps)

    const styleOnDatabase = await styleRepository.findById(styleId)

    expect(styleOnDatabase?.id.toString()).toBe(styleId)
    expect(styleOnDatabase?.name).toBe(updateStyleProps.name)
    expect(styleOnDatabase?.primaryColor).toBe(updateStyleProps.primaryColor)
  })

  it('should not be able to update a style that does not exist', async () => {
    const fakeStyleId = 'style-id-non-exist'

    const response = useCase.execute({
      styleId: fakeStyleId,
    })

    expect(response).rejects.toThrow(
      `Estilo com ID ${fakeStyleId} não foi encontrado`,
    )
  })
})
