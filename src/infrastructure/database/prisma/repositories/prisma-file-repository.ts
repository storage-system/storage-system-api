import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { File } from '@/domain/enterprise/file/file'
import { Injectable } from '@nestjs/common'

import { PrismaFileMapper } from '../mappers/prisma-file-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(private prisma: PrismaService) {}

  async save(record: File): Promise<void> {
    const data = PrismaFileMapper.toPersistence(record)

    await this.prisma.file.create({
      data,
    })
  }

  async findById(anId: string): Promise<File | null> {
    const prismaFile = await this.prisma.file.findFirst({
      where: { id: anId, deletedAt: null },
    })

    if (!prismaFile) return null

    return PrismaFileMapper.toDomain(prismaFile)
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.file.update({
      where: {
        id: anId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async update(record: File): Promise<void> {
    const data = PrismaFileMapper.toPersistence(record)

    await this.prisma.file.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
