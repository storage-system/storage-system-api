import { ApiProperty } from '@nestjs/swagger'

export class HttpTimestampedResponse {
  @ApiProperty({ type: Date })
  createdAt: string

  @ApiProperty({ type: Date, nullable: true })
  updatedAt?: string

  @ApiProperty({ type: Date, nullable: true })
  deletedAt?: string
}
