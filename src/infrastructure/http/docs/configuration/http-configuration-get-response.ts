import { ApiProperty } from '@nestjs/swagger'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'

export class HttpConfigurationGetResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  userId: string

  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  companyId: string

  @ApiProperty({ type: Number })
  daysBeforeOldStock: number

  @ApiProperty({ type: Number })
  warningDays: number

  @ApiProperty({ type: Boolean })
  emailNotification: boolean

  @ApiProperty({ type: Boolean })
  systemNotification: boolean

  @ApiProperty({ type: Boolean })
  autoDiscardAfterExpiration: boolean

  @ApiProperty({ type: Boolean })
  freeShippingOnOldStock: boolean

  @ApiProperty({ type: String, example: ReportFrequency.DIARY })
  reportFrequency: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date
}
