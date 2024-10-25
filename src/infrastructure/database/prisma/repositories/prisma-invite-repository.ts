import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { Invite } from '@/domain/enterprise/invite/invite'
import { Injectable } from '@nestjs/common'

import { PrismaInviteMapper } from '../mappers/prisma-invite-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaInviteRepository implements InviteRepository {
  constructor(private prisma: PrismaService) {}

  async getPendings(companyId: string): Promise<Invite[]> {
    const invites = await this.prisma.invite.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        accessCode: true,
      },
    })

    return invites.map(PrismaInviteMapper.toDomain)
  }

  async findById(anId: string): Promise<Invite | null> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: anId,
      },
      include: {
        accessCode: true,
      },
    })

    if (!invite) {
      return null
    }

    return PrismaInviteMapper.toDomain(invite)
  }

  async refuse(anId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(record: Invite): Promise<void> {
    const data = PrismaInviteMapper.toPersistence(record)

    await this.prisma.invite.create({
      data,
    })
  }

  async update(record: Invite): Promise<void> {
    const data = PrismaInviteMapper.toPersistenceUpdate(record)

    await this.prisma.invite.update({
      where: {
        id: record.id.toString(),
      },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.invite.delete({
      where: {
        id: anId,
      },
    })
  }
}
