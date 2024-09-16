import { createReadStream, ReadStream } from 'fs'
import { Readable } from 'stream'
import { join } from 'path'

import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'

export class InMemoryS3FileStorageGateway extends FileStorageGateway {
  private readonly storage: Record<string, Buffer> = {}

  async put(path: string, stream: Readable): Promise<void> {
    const chunks: Buffer[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    this.storage[path] = Buffer.concat(chunks)
  }

  async get(path: string): Promise<ReadStream> {
    const buffer = this.storage[path]

    if (!buffer) {
      throw new Error('File not found')
    }

    return createReadStream(join(__dirname, '..', '..', 'test', 'fixtures', 'test.txt'))
  }
}
