import { GetPendingInvitesUseCase } from '@/domain/application/invite/get-pending-invites/get-pending-invites-use-case'
import { CreateInviteUseCase } from '@/domain/application/invite/create/create-invite-use-case'
import { AcceptInviteUseCase } from '@/domain/application/invite/accept/accept-invite-use-case'
import { RevokeInviteUseCase } from '@/domain/application/invite/revoke/revoke-invite-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { InviteController } from './invite.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [InviteController],
  providers: [
    CreateInviteUseCase,
    AcceptInviteUseCase,
    GetPendingInvitesUseCase,
    RevokeInviteUseCase,
  ],
})
export class InviteModule {}
