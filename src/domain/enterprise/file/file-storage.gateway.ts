import { Readable } from 'stream'
import { ReadStream } from 'fs'

export abstract class FileStorageGateway {
  abstract put(path: string, stream: Readable): Promise<void>
  abstract get(path: string): Promise<ReadStream>
}
