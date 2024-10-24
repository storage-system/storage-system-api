import { Invite, InviteProps } from '@/domain/enterprise/invite/invite'

export class GetPendingInvitesOutput {
  id: string
  email: string
  roles: string[]

  constructor(anInviteProps: InviteProps & { id: string }) {
    this.id = anInviteProps.id.toString()
    this.email = anInviteProps.email
    this.roles = anInviteProps.roles
  }

  static fromAggregate(invite: Invite) {
    return new GetPendingInvitesOutput(invite.toJSON())
  }
}
