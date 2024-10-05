import { Readable } from 'stream'; 
import { FileID } from '@/domain/enterprise/file/file';
import { FileRepository } from '@/domain/enterprise/file/file-repository';
import ResourceNotFoundException from '@/core/exception/not-found-exception';
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway';

export type DownloadFileUseCaseProps = Readable

export class DownloadFileUseCase {
  constructor(
    private fileRepository: FileRepository,
    private fileStorageRepository: FileStorageGateway
  ) {}

  async execute(
    fileId: string
  ): Promise<Readable> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw ResourceNotFoundException.with('Arquivo', new FileID(fileId));
    }

    return await this.fileStorageRepository.downloadFile(
      file.path
    );
  }
}
