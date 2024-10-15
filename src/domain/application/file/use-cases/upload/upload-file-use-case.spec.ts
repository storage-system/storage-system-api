import { InMemoryFileStorageGateway } from 'test/repositories/in-memory-file-storage.gateway'
import { InMemoryFileRepository } from 'test/repositories/in-memory-file-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UploadFileUseCase } from './upload-file-use-case'

describe('UploadFileUseCase', () => {
  let uploadFileUseCase: UploadFileUseCase
  let fileStorageGateway: FileStorageGateway
  let fileRepository: FileRepository

  beforeEach(() => {
    fileStorageGateway = new InMemoryFileStorageGateway()

    fileRepository = new InMemoryFileRepository()

    uploadFileUseCase = new UploadFileUseCase(
      fileStorageGateway,
      fileRepository,
    )
  })

  it('should upload file and save its metadata', async () => {
    const mockFile = {
      originalname: 'test.txt',
      size: 1024,
      buffer: Buffer.from('test file content'),
    } as Express.Multer.File

    const result = await uploadFileUseCase.execute(mockFile)

    const fileOnDatabase = await fileRepository.findById(result.fileId)
    const fileOnGateway =
      fileOnDatabase?.path &&
      (await fileStorageGateway.getFileUrl(fileOnDatabase?.path))

    expect(fileOnDatabase?.filename).toBe('test.txt')
    expect(fileOnDatabase?.path).toBe('test.txt')
    expect(fileOnDatabase?.size).toBe(1024)
    expect(fileOnGateway).toBe(
      `http://localhost/in-memory/${mockFile.originalname}`,
    )
  })
})
