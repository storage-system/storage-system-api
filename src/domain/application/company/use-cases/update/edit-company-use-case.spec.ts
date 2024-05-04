import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { EditCompanyUseCase } from "./edit-company-use-case";
import { makeCompany } from "test/factories/make-company";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: EditCompanyUseCase

describe('Edit Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new EditCompanyUseCase(inMemoryCompaniesRepository)
  })

  it('should be able to edit a company', async () => {
    const companyId = 'company-01'

    const newCompany = makeCompany({}, new UniqueEntityID(companyId))

    await inMemoryCompaniesRepository.create(newCompany)

    const updateCompany = {
      name: 'company-02',
      email: newCompany.email,
      responsible: newCompany.responsible,
      contact: newCompany.contact,
      companyId,
    }

    await sut.execute(updateCompany)

    expect(inMemoryCompaniesRepository.items[0]).toMatchObject({
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

    await expect(sut.execute(nonExistentCompanyUpdate))
      .rejects.toThrowError(`Empresa com ID ${companyId} não foi encontrado`)
  })
})