import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { Company } from '@/domain/enterprise/company/company'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = []

  async findByEmail(email: string) {
    const company = this.items.find((item) => item.email === email)

    if (!company) {
      return null
    }

    return company
  }

  async findById(id: string): Promise<Company | null> {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async create(company: Company): Promise<void> {
    this.items.push(company)
  }

  async save(company: Company): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === company.id)

    this.items[itemIndex] = company
  }

  async delete(companyId: string): Promise<void> {
    const filteredCompanies = this.items.filter((company) => company.id.toString() !== companyId)
    this.items = filteredCompanies
  }
}
