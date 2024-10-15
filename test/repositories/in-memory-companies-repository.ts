import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
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

  async save(company: Company): Promise<void> {
    this.items.push(company)
  }

  async update(company: Company): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === company.id)

    this.items[itemIndex] = company
  }

  async delete(companyId: string): Promise<void> {
    const filteredCompanies = this.items.filter(
      (company) => company.id.toString() !== companyId,
    )
    this.items = filteredCompanies
  }

  async removeUsers(companyId: string, userIds: string[]): Promise<void> {
    const company = this.items.find(
      (company) => company.id.toString() === companyId,
    )

    if (company) {
      const filteredUsers = company.users.filter(
        (userId) => !userIds.includes(userId),
      )
      company.users = filteredUsers
    }
  }
}
