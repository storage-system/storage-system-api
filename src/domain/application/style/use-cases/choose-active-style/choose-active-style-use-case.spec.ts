import { makeCompany } from 'test/factories/make-company'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { makeStyle } from 'test/factories/make-style'
import { ChooseActiveStyleUseCase, ChooseActiveStyleUseCaseRequest } from './choose-active-style-use-case'

let companyRepository: CompaniesRepository
let styleRepository: StyleRepository
let useCase: ChooseActiveStyleUseCase

describe('Choose Active Style Use Case', () => {
  beforeEach(async () => {
    companyRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()

    useCase = new ChooseActiveStyleUseCase(
      companyRepository,
      styleRepository
    )
  })

  it('dependencies should be defined', (): void => {
    expect(companyRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to choose a active style', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const style = await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
      }
    })

    const styleId = style.id.toString()

    const chooseActiveStyleProps: ChooseActiveStyleUseCaseRequest = {
      styleId,
      companyId: company.id.toString()
    }

    await useCase.execute(chooseActiveStyleProps)

    const styleOnDatabase = await styleRepository.findById(styleId)

    expect(styleOnDatabase?.id.toString()).toBe(styleId)
    expect(styleOnDatabase?.isActive).toBe(true)
  })

  it('should deactivate old active style and activate new style', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const oldStyle = await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
        isActive: true,
      }
    })

    expect(oldStyle?.isActive).toBe(true)

    const newStyle = await makeStyle({
      repository: styleRepository,
      override: {
        companyId: company.id,
        isActive: false,
      }
    })

    expect(newStyle?.isActive).toBe(false)

    const chooseActiveStyleProps: ChooseActiveStyleUseCaseRequest = {
      styleId: newStyle.id.toString(),
      companyId: company.id.toString()
    }

    await useCase.execute(chooseActiveStyleProps)

    const newStyleOnDatabase = await styleRepository.findById(newStyle.id.toString())
    const oldStyleOnDatabase = await styleRepository.findById(oldStyle.id.toString())

    expect(newStyleOnDatabase?.isActive).toBe(true)
    expect(oldStyleOnDatabase?.isActive).toBe(false)
  })

  it('should not be able to choose active style that does not exist', async () => {
    const { id: companyId } = await makeCompany({
      repository: companyRepository,
    })

    const fakeStyleId = 'style-id-non-exist'

    const response = useCase.execute({
      styleId: fakeStyleId,
      companyId: companyId.toString()
    })

    expect(response).rejects.toThrow(`Estilo com ID ${fakeStyleId} não foi encontrado`)
  })

  it('should not be able to choose active style that does company not exist', async () => {
    const { id: styleId } = await makeStyle({
      repository: styleRepository,
    })

    const fakeCompanyId = 'company-id-non-exist'

    const response = useCase.execute({
      styleId: styleId.toString(),
      companyId: fakeCompanyId
    })

    expect(response).rejects.toThrow(`Empresa com ID ${fakeCompanyId} não foi encontrado`)
  })
})
