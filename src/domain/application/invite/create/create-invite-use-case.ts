import { emailTemplatesEnum } from '@/infrastructure/services/email/templates/email-templates'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import NotificationException from '@/core/exception/notification-exception'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Notification } from '@/core/validation/notification'
import { Invite } from '@/domain/enterprise/invite/invite'
import { UserID } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'

import { EmailService } from '../../services/email-service'

export interface CreateInviteUseCaseRequest {
  email: string
  roles?: string[]
  authorId: string
}

export interface CreateInviteUseCaseResponse {
  inviteId: string
}

@Injectable()
export class CreateInviteUseCase {
  constructor(
    private userRepository: UsersRepository,
    private companyRepository: CompaniesRepository,
    private inviteRepository: InviteRepository,
    private emailService: EmailService,
  ) {}

  async execute(
    anInput: CreateInviteUseCaseRequest,
  ): Promise<CreateInviteUseCaseResponse> {
    const notification = Notification.create()
    const { authorId, email, roles } = anInput

    const author = await this.userRepository.findById(authorId)

    if (!author) {
      throw ResourceNotFoundException.with('Responsável', new UserID(authorId))
    }

    const companyId = author.companyId

    if (!companyId) {
      throw new NotificationException(
        'O responsável precisar estar vinculado a uma empresa.',
        notification,
      )
    }

    const company = await this.companyRepository.findById(companyId.toString())

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', companyId)
    }

    const invite = Invite.create({
      authorId: new UserID(authorId),
      companyId: author.companyId,
      roles: roles?.map((role) => role as UserRoles),
      email,
    })

    await this.inviteRepository.save(invite)

    await this.emailService.send({
      to: email,
      subject: 'Allahu Akbar',
      template: emailTemplatesEnum.INVITE_MEMBER,
      properties: {
        author: author.name,
        company: company.tradeName,
        email,
      },
    })

    return {
      inviteId: invite.id.toString(),
    }
  }
}
