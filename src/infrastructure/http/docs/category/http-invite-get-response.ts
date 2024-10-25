import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { ApiProperty } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'

export class HttpInviteGetResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: faker.internet.email() })
  email: string

  @ApiProperty({ type: String, isArray: true, example: [UserRoles.MEMBER] })
  roles: string[]

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, required: false })
  expiresIn?: Date
}
