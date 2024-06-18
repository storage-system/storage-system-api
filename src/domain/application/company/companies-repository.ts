import { Company } from "@/domain/enterprise/company/company";

export abstract class CompaniesRepository {
  abstract findByEmail(email: string): Promise<Company | null>
  abstract findById(id: string): Promise<Company | null>
  abstract create(company: Company): Promise<void>
  abstract save(company: Company): Promise<void>
  abstract delete(companyId: string): Promise<void>
}