import { StatusProduct } from '@/domain/enterprise/product/product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiProperty } from '@nestjs/swagger'

import { HttpPaginationResponse } from '../shared/http-pagination-response'
import { HttpItemResponse } from '../shared/http-item-response'

class HttpEachProductListResponse {
  @ApiProperty({ type: String, example: new UniqueEntityID().toString() })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Number })
  quantityInStock: number

  @ApiProperty({ type: Date })
  manufactureDate: Date

  @ApiProperty({ type: Date })
  dueDate: Date

  @ApiProperty({ type: Number })
  validityInDays: number

  @ApiProperty({ type: String })
  manufacturer?: string

  @ApiProperty({ type: String })
  batch?: string

  @ApiProperty({ type: String, example: StatusProduct.ACTIVE })
  status?: string

  @ApiProperty({ type: String })
  productImage?: string

  @ApiProperty({ type: HttpItemResponse, isArray: true })
  categories?: HttpItemResponse[]

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date

  @ApiProperty({ type: Date, required: false })
  deletedAt?: Date
}

export class HttpProductListResponse extends HttpPaginationResponse {
  @ApiProperty({ type: HttpEachProductListResponse, isArray: true })
  items: HttpEachProductListResponse[]
}
