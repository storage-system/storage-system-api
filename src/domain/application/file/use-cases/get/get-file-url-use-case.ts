import { FileID } from '@/domain/enterprise/file/file';
import { FileRepository } from '@/domain/enterprise/file/file-repository';
import ResourceNotFoundException from '@/core/exception/not-found-exception';
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway';

export class DownloadFileUseCase {
  constructor(
    private fileRepository: FileRepository,
    private fileStorageRepository: FileStorageGateway
  ) {}

  async execute(
    fileId: string
  ): Promise<{ fileUrl: string }> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw ResourceNotFoundException.with('Arquivo', new FileID(fileId));
    }

    const fileUrl = await this.fileStorageRepository.getFileUrl(
      file.path
    );

    return {
      fileUrl,
    }
  }
}
