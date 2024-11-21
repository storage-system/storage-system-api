export interface OldStockMetrics {
  totalProductOldStock: number
  totalOldStockValue: number
  expiringIn30Days: number
  expiringIn60Days: number
  expiringIn90Days: number
}

export interface ProductMetrics {
  totalStockQuantity: number
  totalStockValue: number
  productsInWarningDays: number
}

export interface MetricsOutput {
  oldStockMetrics: OldStockMetrics
  productMetrics: ProductMetrics
}
