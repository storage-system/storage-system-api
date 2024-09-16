import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"
import { makeCompany } from "test/factories/make-company"
import { CompaniesRepository } from "@/domain/enterprise/company/companies-repository"
import { CreateStyleUseCase, CreateStyleUseCaseRequest } from "./create-style-use-case"
import { StyleRepository } from "@/domain/enterprise/style/style-repository"
import { InMemoryStyleRepository } from "test/repositories/in-memory-style-repository"
import { faker } from "@faker-js/faker"

let companiesRepository: CompaniesRepository
let styleRepository: StyleRepository

let useCase: CreateStyleUseCase

describe('Create Style Use Case', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    styleRepository = new InMemoryStyleRepository()

    useCase = new CreateStyleUseCase(
      companiesRepository,
      styleRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(companiesRepository).toBeDefined()
    expect(styleRepository).toBeDefined()
  })

  it('should be able to create a new style', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })
    const companyId = company.id.toString()
    const styleMock: CreateStyleUseCaseRequest = {
      name: 'Style 1',
      companyId,
      isActive: false,
      backgroundColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
    }

    const { styleId } = await useCase.execute(styleMock)

    const styleOnDatabase = await styleRepository.findById(styleId)

    expect(styleOnDatabase?.id.toString()).toBe(styleId)
    expect(styleOnDatabase?.companyId).toBe(company.id.toString())
    expect(styleOnDatabase?.backgroundColor).toBe(styleMock.backgroundColor)
    expect(styleOnDatabase?.primaryColor).toBe(styleMock.primaryColor)
    expect(styleOnDatabase?.secondaryColor).toBe(styleMock.secondaryColor)
    expect(styleOnDatabase?.tertiaryColor).toBe(styleMock.tertiaryColor)
    expect(styleOnDatabase?.textColor).toBe(styleMock.textColor)
  })

  it('should not be able to create a style that company does not exist', async () => {
    const companyNonExists = 'company-id'

    const styleMock: CreateStyleUseCaseRequest = {
      name: 'Style 1',
      companyId: companyNonExists,
      isActive: false,
      backgroundColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
    }

    expect(useCase.execute(styleMock)).rejects.toThrowError('Erro ao criar estilização.')
  })
})
