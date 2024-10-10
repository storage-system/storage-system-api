import { ApiProperty } from '@nestjs/swagger'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class HttpFileResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: 'file.pdf' })
  filename: string

  @ApiProperty({ type: Number, example: 100 })
  size: number
}
