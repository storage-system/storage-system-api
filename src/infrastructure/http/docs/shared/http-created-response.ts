import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'

export class HttpCreatedResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string
}
