import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FileRepository } from "@/domain/enterprise/file/file-repository";
import { File } from "@/domain/enterprise/file/file";
import { PrismaFileMapper } from "../mappers/prisma-file-mapper";

@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(private prisma: PrismaService) { }

  async create(record: File): Promise<void> {
    const data = PrismaFileMapper.toPersistence(record)

    await this.prisma.file.create({
      data,
    })
  }

  async findById(anId: string): Promise<File | null> {
    const file = await this.prisma.file.findUnique({
      where: {
        id: anId
      }
    })

    if (!file) {
      return null
    }

    return PrismaFileMapper.toDomain(file)
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.file.update({
      where: {
        id: anId
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async update(record: File): Promise<void> {
    const data = PrismaFileMapper.toPersistence(record)

    await this.prisma.file.update({
      where: {
        id: data.id
      },
      data,
    })
  }
}