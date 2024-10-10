import { ApiProperty } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class HttpItemResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: faker.person.fullName() })
  name: string
}
