import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { EditCompanyUseCase } from "./edit-company-use-case";
import { makeCompany } from "test/factories/make-company";
import { CompaniesRepository } from "../../../../enterprise/company/companies-repository";

let repository: CompaniesRepository
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
    const newCompany = await makeCompany({
      repository,
    })

    const updateCompany = {
      name: 'company-02',
      email: newCompany.email,
      responsible: newCompany.responsible,
      contact: newCompany.contact,
      companyId: newCompany.id.toString()
    }

    await useCase.execute(updateCompany)

    const companyOnDatabase = await repository.findById(updateCompany.companyId)

    expect(companyOnDatabase?.name).toEqual(updateCompany.name)
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