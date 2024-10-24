import { Pagination } from '@/core/entities/pagination'
import { Repository } from '@/core/repository'

import { Invite } from './invite'

export abstract class InviteRepository extends Repository<Invite> {
  abstract findAll({
    page,
    perPage,
  }: {
    page: number
    perPage: number
  }): Promise<Pagination<Invite>>

  abstract getPendings(companyId: string): Promise<Invite[]>
  abstract refuse(anId: string): Promise<void>
  abstract revoke(anId: string): Promise<void>
}
