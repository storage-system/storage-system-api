import { File, FileID } from '@/domain/enterprise/file/file'
import { Prisma, File as PrismaFile } from '@prisma/client'

export class PrismaFileMapper {
  static toDomain(raw: PrismaFile): File {
    return File.create({
      id: new FileID(raw.id),
      filename: raw.filename,
      path: raw.path,
      size: raw.size,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      deletedAt: raw.deletedAt ?? undefined,
    })
  }

  static toPersistence(file: File): Prisma.FileUncheckedCreateInput {
    return {
      id: file.id.toString(),
      filename: file.filename,
      path: file.path,
      size: file.size,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt ?? undefined,
      deletedAt: file.deletedAt ?? undefined,
    }
  }
}
