import {
  Prisma,
  Invite as PrismaInvite,
  AccessCode as PrismaAccesscode,
} from '@prisma/client'
import { Invite, InviteID } from '@/domain/enterprise/invite/invite'
import { AccessCode } from '@/domain/enterprise/invite/access-code'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { CompanyID } from '@/domain/enterprise/company/company'
import { UserID } from '@/domain/enterprise/user/user'

export class PrismaInviteMapper {
  static toDomain(
    raw: PrismaInvite & {
      accessCode: PrismaAccesscode
    },
  ): Invite {
    return Invite.create(
      {
        email: raw.email,
        expiresIn: raw.expiresIn,
        accessCode: AccessCode.create({
          code: raw.accessCode.code,
          createdAt: raw.accessCode.createdAt,
          expiresAt: raw.accessCode.expiresAt,
        }),
        roles: raw.roles as UserRoles[],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
        authorId: new UserID(raw.authorId),
        companyId: new CompanyID(raw.companyId),
      },
      new InviteID(raw.id),
    )
  }

  static toPersistence(invite: Invite): Prisma.InviteCreateInput {
    return {
      id: invite.id.toString(),
      email: invite.email,
      accessCode: {
        create: {
          code: invite.accessCode.code,
          expiresAt: invite.accessCode.expiresAt,
          createdAt: invite.accessCode.createdAt,
        },
      },
      company: {
        connect: {
          id: invite.companyId.toString(),
        },
      },
      author: {
        connect: {
          id: invite.authorId,
        },
      },
      expiresIn: invite.expiresIn,
      createdAt: invite.createdAt,
      updatedAt: invite.updatedAt ?? undefined,
      deletedAt: invite.deletedAt ?? undefined,
    }
  }

  static toPersistenceUpdate(invite: Invite): Prisma.InviteUpdateInput {
    return {
      id: invite.id.toString(),
      email: invite.email,
      accessCode: {
        connect: {
          code: invite.accessCode.code,
        },
      },
      company: {
        connect: {
          id: invite.companyId.toString(),
        },
      },
      author: {
        connect: {
          id: invite.authorId,
        },
      },
      expiresIn: invite.expiresIn,
      createdAt: invite.createdAt,
      updatedAt: invite.updatedAt ?? undefined,
      deletedAt: invite.deletedAt ?? undefined,
    }
  }
}
