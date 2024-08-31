import { makeCompany } from 'test/factories/make-company'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { InMemoryStyleRepository } from 'test/repositories/in-memory-style-repository'
import { makeStyle } from 'test/factories/make-style'
import { DeleteStyleUseCase } from './delete-style-use-case'

let companyRepository: CompaniesRepository
let styleRepository: StyleRepository
let useCase: DeleteStyleUseCase

describe('Delete Style Use Case', () => {
  beforeEach(async () => {
    companyRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()

    useCase = new DeleteStyleUseCase(styleRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(companyRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to delete style', async () => {
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

    await useCase.execute({
      styleId,
    })

    const styleOnDatabase = await styleRepository.findById(styleId)

    console.log('styleOnDatabase', styleOnDatabase)

    expect(styleOnDatabase?.deletedAt).toBeDefined()
  })

  it('should not be able to delete a style that does not exist', async () => {
    const fakeStyleId = 'style-id-non-exist'

    const response = useCase.execute({
      styleId: fakeStyleId,
    })

    expect(response).rejects.toThrow(`Estilo com ID ${fakeStyleId} não foi encontrado`)
  })
})
