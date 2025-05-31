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

export interface CategoryOverview {
  name: string
  value: number
  color: string
}

export interface DateData {
  periodo: string
  fabricacao: number
  validade: number
  vencidos: number
}

export interface GeneralStockMetrics {
  totalProducts: number
  activeCategories: number
  totalValue: number
  activeProducts: number
  criticalStockProducts: number
  validProducts: number
  categoryOverview: CategoryOverview[]
  dateData: DateData[]
}
