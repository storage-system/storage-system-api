import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { DownloadFileUseCase } from '@/domain/application/file/use-cases/download/download-file-use-case'
import { UploadFileUseCase } from '@/domain/application/file/use-cases/upload/upload-file-use-case'
import { DeleteFileUseCase } from '@/domain/application/file/use-cases/delete/delete-file-use-case'
import { GetFileUrlUseCase } from '@/domain/application/file/use-cases/get/get-file-url-use-case'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { HttpFileCreatedResponse } from './dto/http-file-created-response'
import { HttpGetFileUrlResponse } from './dto/http-get-file-url-response'

@ApiTags('Files')
@Controller('/files')
export class FileController {
  constructor(
    private uploadFileUseCase: UploadFileUseCase,
    private getFileUrlUseCase: GetFileUrlUseCase,
    private downloadFileUseCase: DownloadFileUseCase,
    private deleteFileUseCase: DeleteFileUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ type: HttpFileCreatedResponse })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { fileId } = await this.uploadFileUseCase.execute(file)
    return { id: fileId }
  }

  @ApiOkResponse({ type: HttpGetFileUrlResponse })
  @Get('url/:fileId')
  async getFileUrl(@Param('fileId') fileId: string) {
    return await this.getFileUrlUseCase.execute(fileId)
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    return await this.downloadFileUseCase.execute(fileId)
  }

  @Delete('delete/:fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    return await this.deleteFileUseCase.execute(fileId)
  }
}
