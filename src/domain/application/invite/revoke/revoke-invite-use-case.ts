import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { InviteID } from '@/domain/enterprise/invite/invite'
import { Injectable } from '@nestjs/common'

export interface RevokeInviteUseCaseRequest {
  inviteId: string
}

@Injectable()
export class RevokeInviteUseCase {
  constructor(private inviteRepository: InviteRepository) {}

  async execute({ inviteId }: RevokeInviteUseCaseRequest): Promise<void> {
    const invite = await this.inviteRepository.findById(inviteId)

    if (!invite) {
      throw ResourceNotFoundException.with('Convite', new InviteID(inviteId))
    }

    invite.revoke()

    await this.inviteRepository.update(invite)
  }
}
