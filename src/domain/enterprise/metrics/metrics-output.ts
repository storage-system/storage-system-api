export interface ProductMetrics {
  id: string | undefined
  name: string | undefined
  dueDate: Date
  daysToExpire: number
  quantity: number
  price: number
  category: string
}

export interface OldStockMetrics {
  expiredCount: number
  criticalCount: number
  atRiskValue: number
  expirationChartData: {
    name: string
    quantidade: number
    color: string
  }[]
  criticalProducts: ProductMetrics[]
  expiredProducts: ProductMetrics[]
  warningProducts: ProductMetrics[]
}

export interface ProductMetrics2 {
  totalStockQuantity: number
  totalStockValue: number
  productsInWarningDays: number
}

export interface MetricsOutput {
  oldStockMetrics: OldStockMetrics
  productMetrics: ProductMetrics2
}
