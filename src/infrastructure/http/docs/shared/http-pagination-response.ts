import { ApiProperty } from '@nestjs/swagger'

export abstract class HttpPaginationResponse {
  abstract items: unknown[]

  @ApiProperty({ type: Number })
  total: number

  @ApiProperty({ type: Number })
  perPage: number

  @ApiProperty({ type: Number })
  page: number
}
