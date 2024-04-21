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

  async create(company: Company): Promise<void> {
    this.items.push(company)
  }
}
