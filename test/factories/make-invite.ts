import {
  Invite,
  InviteID,
  InviteProps,
} from '@/domain/enterprise/invite/invite'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { CompanyID } from '@/domain/enterprise/company/company'
import { UserID } from '@/domain/enterprise/user/user'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeInvite({
  repository,
  override,
}: FactoryProp<
  Invite,
  Partial<
    InviteProps & {
      id: string
    }
  >
> = {}): Promise<Invite> {
  const invite = Invite.create(
    {
      authorId: override?.authorId ?? new UserID(),
      companyId: override?.companyId ?? new CompanyID(),
      email: faker.internet.email(),
      roles: [UserRoles.MEMBER],
      ...override,
    },
    new InviteID(override?.id),
  )

  if (repository) {
    await repository.save(invite)
  }

  return invite
}
