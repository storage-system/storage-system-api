import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UploadFileUseCase } from './upload-file-use-case';
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway';
import { FileRepository } from '@/domain/enterprise/file/file-repository';
import { File } from '@/domain/enterprise/file/file';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository';
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository';
import { makeCompany } from 'test/factories/make-company';

describe('UploadFileUseCase', () => {
  let uploadFileUseCase: UploadFileUseCase;
  let companyRepository: CompaniesRepository;
  let fileStorageGateway: FileStorageGateway;
  let fileRepository: FileRepository;

  beforeEach(() => {
    companyRepository = new InMemoryCompaniesRepository()

    fileStorageGateway = {
      uploadFile: vi.fn(),
    } as unknown as FileStorageGateway;

    fileRepository = {
      create: vi.fn(),
    } as unknown as FileRepository;

    uploadFileUseCase = new UploadFileUseCase(
      companyRepository,
      fileStorageGateway,
      fileRepository
    );
  });

  it('should upload file and save its metadata', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const mockFile = {
      originalname: 'test.txt',
      size: 1024,
      buffer: Buffer.from('test file content'),
    } as Express.Multer.File;

    const companyId = company.id.toString();

    (fileStorageGateway.uploadFile as ReturnType<typeof vi.fn>).mockResolvedValue('uploaded-test.txt');

    const result = await uploadFileUseCase.execute(mockFile, companyId);

    expect(fileStorageGateway.uploadFile).toHaveBeenCalledWith(mockFile);

    expect(fileRepository.create).toHaveBeenCalledWith(expect.any(File));

    expect(result.filename).toBe('test.txt');
    expect(result.path).toBe('uploaded-test.txt');
    expect(result.size).toBe(1024);
    expect(result.companyId?.toString()).toBe(companyId);
  });

  it('should throw an error if upload fails', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const mockFile = {
      originalname: 'test.txt',
      size: 1024,
      buffer: Buffer.from('test file content'),
    } as Express.Multer.File;
    
    const companyId = company.id.toString();

    (fileStorageGateway.uploadFile as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Upload failed'));

    await expect(uploadFileUseCase.execute(mockFile, companyId)).rejects.toThrow('Upload failed');
  });
});
