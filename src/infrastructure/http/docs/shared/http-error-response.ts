import { ApiProperty } from '@nestjs/swagger'

export class HttpErrorResponse {
  @ApiProperty({
    type: Number,
    description: 'Status code of the response',
    example: 400,
  })
  statusCode: number

  @ApiProperty({
    type: String,
    description: 'Message of the response',
    example: 'Bad Request',
  })
  message: string

  @ApiProperty({
    type: String,
    description: 'Error message',
    example: ['Invalid request'],
    isArray: true,
  })
  errors: string[]
}
