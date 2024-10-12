import { UserRoles } from '@/domain/enterprise/user/user-types'
import { SearchQuery } from '@/core/entities/search-query'

export interface ListUsersCommandProps {
  page: number
  perPage: number
  companyId: string
  roles: UserRoles[]
}

export class ListUsersCommand extends SearchQuery {
  companyId?: string
  roles?: UserRoles[]

  protected constructor({
    page = 1,
    perPage = 10,
    companyId,
    roles,
  }: Partial<ListUsersCommandProps>) {
    super(page, perPage)
    this.companyId = companyId
    this.roles = roles
  }

  static create({
    page,
    perPage,
    companyId,
    roles,
  }: Partial<ListUsersCommandProps>) {
    return new ListUsersCommand({
      page,
      perPage,
      companyId,
      roles,
    })
  }
}
