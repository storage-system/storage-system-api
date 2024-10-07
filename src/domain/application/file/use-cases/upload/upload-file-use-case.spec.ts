import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UploadFileUseCase } from './upload-file-use-case';
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway';
import { FileRepository } from '@/domain/enterprise/file/file-repository';
import { File } from '@/domain/enterprise/file/file';

describe('UploadFileUseCase', () => {
  let uploadFileUseCase: UploadFileUseCase;
  let fileStorageGateway: FileStorageGateway;
  let fileRepository: FileRepository;

  beforeEach(() => {
    fileStorageGateway = {
      uploadFile: vi.fn(),
    } as unknown as FileStorageGateway;

    fileRepository = {
      create: vi.fn(),
    } as unknown as FileRepository;

    uploadFileUseCase = new UploadFileUseCase(
      fileStorageGateway,
      fileRepository
    );
  });

  it('should upload file and save its metadata', async () => {
    const mockFile = {
      originalname: 'test.txt',
      size: 1024,
      buffer: Buffer.from('test file content'),
    } as Express.Multer.File;

    (fileStorageGateway.uploadFile as ReturnType<typeof vi.fn>).mockResolvedValue('uploaded-test.txt');

    const result = await uploadFileUseCase.execute(mockFile);

    expect(fileStorageGateway.uploadFile).toHaveBeenCalledWith(mockFile);

    expect(fileRepository.create).toHaveBeenCalledWith(expect.any(File));

    expect(result.filename).toBe('test.txt');
    expect(result.path).toBe('uploaded-test.txt');
    expect(result.size).toBe(1024);
  });

  it('should throw an error if upload fails', async () => {
    const mockFile = {
      originalname: 'test.txt',
      size: 1024,
      buffer: Buffer.from('test file content'),
    } as Express.Multer.File;

    (fileStorageGateway.uploadFile as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Upload failed'));

    await expect(uploadFileUseCase.execute(mockFile)).rejects.toThrow('Upload failed');
  });
});
