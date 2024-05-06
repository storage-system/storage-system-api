import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { EditCompanyUseCase } from "./edit-company-use-case";
import { makeCompany } from "test/factories/make-company";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let repository: InMemoryCompaniesRepository
let useCase: EditCompanyUseCase

describe('Edit Company', () => {
  beforeEach(() => {
    repository = new InMemoryCompaniesRepository()
    useCase = new EditCompanyUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should be able to edit a company', async () => {
    const companyId = 'company-01'

    const newCompany = makeCompany({}, new UniqueEntityID(companyId))

    await repository.create(newCompany)

    const updateCompany = {
      name: 'company-02',
      email: newCompany.email,
      responsible: newCompany.responsible,
      contact: newCompany.contact,
      companyId,
    }

    await useCase.execute(updateCompany)

    expect(repository.items[0]).toMatchObject({
      name: updateCompany.name,
    })
  })

  it('should not be able to edit a company that does not exist', async () => {
    const companyId = 'company-id-01'
    const nonExistentCompanyUpdate = {
      companyId,
      name: 'company-01',
      contact: 'contact-01',
      email: 'email-01@example.com',
      responsible: 'responsible-01'
    }

    await expect(useCase.execute(nonExistentCompanyUpdate))
      .rejects.toThrowError(`Empresa com ID ${companyId} não foi encontrado`)
  })
})