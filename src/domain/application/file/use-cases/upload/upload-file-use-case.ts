import { Injectable } from '@nestjs/common'

import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { File } from '@/domain/enterprise/file/file'
import { FileRepository } from '@/domain/enterprise/file/file-repository'

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(file: Express.Multer.File): Promise<File> {
    const uploadedFileName = await this.fileStorageGateway.uploadFile(file);
    
    const newFile = File.create({
      filename: file.originalname,
      path: uploadedFileName, 
      size: file.size,
    });

    await this.fileRepository.create(newFile);

    return newFile;
  }
}
