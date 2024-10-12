import { Company } from '@/domain/enterprise/company/company'
import { Repository } from '@/core/repository'

export abstract class CompaniesRepository extends Repository<Company> {
  abstract findByEmail(email: string): Promise<Company | null>
  abstract removeUsers(companyId: string, userIds: string[]): Promise<void>
}
