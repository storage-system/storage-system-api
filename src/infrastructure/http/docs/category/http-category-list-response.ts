import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'

import { HttpPaginationResponse } from '../shared/http-pagination-response'

class HttpEachCategoryListResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Boolean, required: false })
  isActive?: boolean

  @ApiProperty({ type: String })
  iconId?: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date
}

export class HttpCategoryListResponse extends HttpPaginationResponse {
  @ApiProperty({ type: HttpEachCategoryListResponse, isArray: true })
  items: HttpEachCategoryListResponse[]
}
