import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import NotificationException from '@/core/exception/notification-exception'
import { Notification } from '@/core/validation/notification'
import { User, UserID } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'

import { HashGenerator } from '../../cryptography/hash-generator'

interface UserProps {
  name: string
  password: string
  phone: string
}

export interface AcceptInviteUseCaseRequest {
  inviteId: string
  userAccount: UserProps
}

export interface AcceptInviteUseCaseResponse {
  userId: string
}

@Injectable()
export class AcceptInviteUseCase {
  constructor(
    private userRepository: UsersRepository,
    private inviteRepository: InviteRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    anInput: AcceptInviteUseCaseRequest,
  ): Promise<AcceptInviteUseCaseResponse> {
    const notification = Notification.create()
    const { inviteId, userAccount } = anInput

    const invite = await this.inviteRepository.findById(inviteId)

    if (!invite) {
      throw ResourceNotFoundException.with('Convite', new UserID(inviteId))
    }

    invite.validate(notification)

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao aceitar convite', notification)
    }

    const hashedPassword = await this.hashGenerator.hash(userAccount.password)

    const user = User.create({
      name: userAccount.name,
      phone: userAccount.phone,
      password: hashedPassword,
      email: invite.email,
      roles: invite.roles,
      companyId: invite.companyId,
    })

    await this.userRepository.save(user)
    await this.inviteRepository.delete(inviteId)

    return {
      userId: user.id.toString(),
    }
  }
}
