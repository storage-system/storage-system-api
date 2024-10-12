import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'

export class HttpStyleGetResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  companyId: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Boolean, required: false })
  isActive: boolean

  @ApiProperty({ type: String })
  backgroundColor: string

  @ApiProperty({ type: String })
  textColor: string

  @ApiProperty({ type: String })
  primaryColor: string

  @ApiProperty({ type: String })
  secondaryColor: string

  @ApiProperty({ type: String })
  tertiaryColor: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date
}
