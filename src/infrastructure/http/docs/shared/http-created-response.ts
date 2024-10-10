import { ApiProperty } from '@nestjs/swagger'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class HttpCreatedResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string
}
