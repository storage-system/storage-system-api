import { Readable } from 'stream';
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway';

class InMemoryFileStorageGateway extends FileStorageGateway {
  public files = new Map();

  async getFileUrl(path: string) {
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`);
    }
    return `http://localhost/in-memory/${path}`;
  }

  async uploadFile(file: Express.Multer.File) {
    const path = file.originalname;
    this.files.set(path, file.buffer);
    return path;
  }

  async deleteFile(path: string) {
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`);
    }
    this.files.delete(path);
  }

  async downloadFile(path: string) {
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`);
    }
    const fileBuffer = this.files.get(path);
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    return stream;
  }
}

export { InMemoryFileStorageGateway };
