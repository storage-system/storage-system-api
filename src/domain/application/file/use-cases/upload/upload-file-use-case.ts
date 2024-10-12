import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import NotificationException from '@/core/exception/notification-exception'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { Notification } from '@/core/validation/notification'
import { File } from '@/domain/enterprise/file/file'
import { Injectable } from '@nestjs/common'

interface UploadFileUseCaseResponse {
  fileId: string
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(file: Express.Multer.File): Promise<UploadFileUseCaseResponse> {
    const notification = Notification.create()

    const uploadedFileName = await this.fileStorageGateway
      .uploadFile(file)
      .catch((e) => {
        throw new NotificationException(
          'Impossível realizar upload do arquivo',
          notification,
        )
      })

    const newFile = File.create({
      filename: file.originalname,
      path: uploadedFileName,
      size: file.size,
    })

    await this.fileRepository.create(newFile)

    return { fileId: newFile.id.toString() }
  }
}
