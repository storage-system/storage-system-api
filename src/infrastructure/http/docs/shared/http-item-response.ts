import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'

export class HttpItemResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: faker.person.fullName() })
  name: string
}
