import { Global, Module } from '@nestjs/common'

import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'

import { MinioFileStorageGateway } from '@/infrastructure/services/file-storage/minio.file-storage.gateway'
import { FileController } from '@/infrastructure/http/modules/file/file.controller'
import { EnvModule } from '@/infrastructure/env/env.module'
import { UploadFileUseCase } from '@/domain/application/file/use-cases/upload/upload-file-use-case'
import { GetFileUrlUseCase } from '@/domain/application/file/use-cases/get/get-file-url-use-case'
import { DownloadFileUseCase } from '@/domain/application/file/use-cases/download/download-file-use-case'
import { DeleteFileUseCase } from '@/domain/application/file/use-cases/delete/delete-file-use-case'
import { DatabaseModule } from '@/infrastructure/database/database.module'

@Global()
@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [FileController],
  providers: [
    {
      provide: FileStorageGateway,
      useClass: MinioFileStorageGateway,
    },
    UploadFileUseCase,
    GetFileUrlUseCase,
    DownloadFileUseCase,
    DeleteFileUseCase,
  ],
  exports: [FileStorageGateway],
})
export class FileModule {}
