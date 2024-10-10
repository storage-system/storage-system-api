import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { EnvService } from '@/infrastructure/env/env.service'
import { Inject, Injectable } from '@nestjs/common'
import { ReadStream } from 'fs'
import * as Minio from 'minio'
import { Readable } from 'stream'

@Injectable()
export class MinioFileStorageGateway implements FileStorageGateway {
  private minioClient: Minio.Client
  private bucketName: string

  constructor(
    @Inject(EnvService)
    private readonly env: EnvService
  ) {
    this.minioClient = new Minio.Client({
      endPoint: this.env.get('MINIO_ENDPOINT'),
      port: Number(this.env.get('MINIO_PORT')),
      useSSL: this.env.get('MINIO_USE_SSL') === 'true',
      accessKey: this.env.get('MINIO_ACCESS_KEY'),
      secretKey: this.env.get('MINIO_SECRET_KEY')
    })
    
    this.bucketName = this.env.get('MINIO_BUCKET_NAME')
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1')
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size
    )
    
    return fileName
  }

  async getFileUrl(fileName: string) {
    const expiresTime = 60
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
      expiresTime
    )
  }

  async downloadFile(fileName: string): Promise<Readable> {
    return await this.minioClient.getObject(this.bucketName, fileName)
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName)
  }
}
