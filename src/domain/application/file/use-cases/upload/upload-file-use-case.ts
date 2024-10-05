import { Injectable } from '@nestjs/common'
import { Express } from 'express'

import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { File } from '@/domain/enterprise/file/file'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly companyRepository: CompaniesRepository,
    private readonly fileStorageGateway: FileStorageGateway,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(file: Express.Multer.File, companyId: string): Promise<File> {
    const findCompany = await this.companyRepository.findById(companyId)

    if (!findCompany) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId)
      );
    }
    
    const uploadedFileName = await this.fileStorageGateway.uploadFile(file);
    
    const newFile = File.create({
      filename: file.originalname,
      path: uploadedFileName, 
      size: file.size,
      companyId: new UniqueEntityID(companyId),
    });

    await this.fileRepository.create(newFile);

    return newFile;
  }
}
