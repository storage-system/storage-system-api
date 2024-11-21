import { ApiProperty } from '@nestjs/swagger'

export class HttpOldStockMetricsResponse {
  @ApiProperty({ type: Number })
  totalProductOldStock: number

  @ApiProperty({ type: Number })
  totalOldStockValue: number

  @ApiProperty({ type: Number })
  expiringIn30Days: number

  @ApiProperty({ type: Number })
  expiringIn60Days: number

  @ApiProperty({ type: Number })
  expiringIn90Days: number
}

export class HttpProductsMetricsResponse {
  @ApiProperty({ type: Number })
  totalStockQuantity: number

  @ApiProperty({ type: Number })
  totalStockValue: number

  @ApiProperty({ type: Number })
  productsInWarningDays: number
}

export class HttpGetMetricsResponse {
  @ApiProperty({ type: HttpOldStockMetricsResponse })
  oldStockMetrics: HttpOldStockMetricsResponse

  @ApiProperty({ type: HttpProductsMetricsResponse })
  productMetrics: HttpProductsMetricsResponse
}
