import { InMemoryFileRepository } from 'test/repositories/in-memory-file-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeFile } from 'test/factories/make-file'

import { DeleteFileUseCase } from './delete-file-use-case'

describe('DeleteFileUseCase', () => {
  let deleteFileUseCase: DeleteFileUseCase
  let fileStorageGateway: FileStorageGateway
  let fileRepository: FileRepository

  beforeEach(() => {
    fileStorageGateway = {
      deleteFile: vi.fn(),
    } as unknown as FileStorageGateway

    fileRepository = new InMemoryFileRepository()

    deleteFileUseCase = new DeleteFileUseCase(
      fileStorageGateway,
      fileRepository,
    )
  })

  it('should delete the file and its metadata', async () => {
    const mockFile = await makeFile({
      repository: fileRepository,
    })

    await deleteFileUseCase.execute(mockFile.id.toString())

    expect(fileStorageGateway.deleteFile).toHaveBeenCalledWith(mockFile.path)

    const fileOnDatabase = await fileRepository.findById(mockFile.id.toString())
    expect(fileOnDatabase).toBeNull()
  })

  it('should throw an error if the file is not found', async () => {
    const fileId = 'file-123'

    await expect(deleteFileUseCase.execute(fileId)).rejects.toThrow()
  })
})
