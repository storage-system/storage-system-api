import { Injectable } from '@nestjs/common'

import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import NotificationException from '@/core/exception/notification-exception'

@Injectable()
export class DeleteFileUseCase {
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(fileId: string): Promise<void> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw NotificationException.withAnError(
        new Error('File not found.')
      );
    }

    await this.fileStorageGateway.deleteFile(file.path);
    await this.fileRepository.delete(file.id.toString());
  }
}