import { ApiProperty } from '@nestjs/swagger'

export class HttpGetFileUrlResponse {
  @ApiProperty({ type: String, example: 'string' })
  fileUrl: string
}
