import { Readable } from 'stream'

export abstract class FileStorageGateway {
  abstract getFileUrl(path: string): Promise<string>
  abstract uploadFile(file: Express.Multer.File): Promise<string>
  abstract deleteFile(path: string): Promise<void>
  abstract downloadFile(path: string): Promise<Readable>
}
