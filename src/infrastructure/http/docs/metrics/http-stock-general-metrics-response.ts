import { ApiProperty } from '@nestjs/swagger'

export class CategoryOverviewDto {
  @ApiProperty({ example: 'Bobinas de Aço' })
  name: string

  @ApiProperty({ example: 5 })
  value: number

  @ApiProperty({ example: '#8b5cf6' })
  color: string
}

export class DateDataDto {
  @ApiProperty({ example: 'Jan/2025' })
  periodo: string

  @ApiProperty({ example: 100 })
  fabricacao: number

  @ApiProperty({ example: 90 })
  validade: number

  @ApiProperty({ example: 10 })
  vencidos: number
}

export class StockGeneralMetricsResponseDto {
  @ApiProperty({ example: 1234 })
  totalProducts: number

  @ApiProperty({ example: 8 })
  activeCategories: number

  @ApiProperty({ example: 45678 })
  totalValue: number

  @ApiProperty({ example: 1199 })
  activeProducts: number

  @ApiProperty({ example: 35 })
  criticalStockProducts: number

  @ApiProperty({ example: 37 })
  validProducts: number

  @ApiProperty({ type: [CategoryOverviewDto] })
  categoryOverview: CategoryOverviewDto[]

  @ApiProperty({ type: [DateDataDto] })
  dateData: DateDataDto[]
}
