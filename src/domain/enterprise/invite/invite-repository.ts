import { Repository } from '@/core/repository'

import { Invite } from './invite'

export abstract class InviteRepository extends Repository<Invite> {
  abstract getPendings(companyId: string): Promise<Invite[]>
  abstract refuse(anId: string): Promise<void>
}
