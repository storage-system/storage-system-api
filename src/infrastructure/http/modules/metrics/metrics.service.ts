import { OldStockMetrics } from '@/domain/enterprise/metrics/metrics-output'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../../database/prisma/prisma.service'

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Usado na aba de "Estoque Antigo"
  async findOldStockMetrics(companyId: string): Promise<OldStockMetrics> {
    const products = await this.getProducts(companyId)
    return this.calculateOldStockMetrics(products)
  }

  private async getProducts(companyId: string) {
    return await this.prisma.product.findMany({
      where: {
        companyId,
        quantityInStock: { gt: 0 },
      },
      select: {
        dueDate: true,
        quantityInStock: true,
        originalPrice: true,
        name: true,
        id: true,
        categories: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  // 🔸 Cálculo das métricas de estoque antigo
  private async calculateOldStockMetrics(
    products: {
      id: string
      name: string
      originalPrice: number
      quantityInStock: number
      dueDate: Date
      categories: { name: string }[]
    }[],
  ): Promise<OldStockMetrics> {
    const now = new Date()

    // Função auxiliar para calcular dias para expirar
    const calculateDaysToExpire = (dueDate: Date) =>
      Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Estrutura inicial para acumular métricas
    const initialMetrics = {
      expiredCount: 0,
      criticalCount: 0,
      atRiskValue: 0,
      expiredProducts: [] as any[],
      criticalProducts: [] as any[],
      warningProducts: [] as any[],
      chartBuckets: {
        vencidos: 0,
        dias7: 0,
        dias15: 0,
        dias30: 0,
        dias30mais: 0,
      },
    }

    const metrics = products.reduce((acc, product) => {
      const daysToExpire = calculateDaysToExpire(new Date(product.dueDate))

      const categoryName =
        product.categories.length > 0
          ? product.categories[0].name
          : 'Sem categoria'

      const productData = {
        id: product.id,
        name: product.name,
        dueDate: product.dueDate,
        daysToExpire,
        quantity: product.quantityInStock,
        price: product.originalPrice,
        category: categoryName,
      }

      const productValue = product.originalPrice * product.quantityInStock

      if (daysToExpire <= 0) {
        acc.expiredCount++
        acc.atRiskValue += productValue
        acc.chartBuckets.vencidos++
        acc.expiredProducts.push({ ...productData, status: 'expired' })
      } else if (daysToExpire <= 7) {
        acc.criticalCount++
        acc.atRiskValue += productValue
        acc.chartBuckets.dias7++
        acc.criticalProducts.push({ ...productData, status: 'critical' })
      } else if (daysToExpire <= 15) {
        acc.chartBuckets.dias15++
        acc.warningProducts.push({ ...productData, status: 'warning' })
      } else if (daysToExpire <= 30) {
        acc.chartBuckets.dias30++
      } else {
        acc.chartBuckets.dias30mais++
      }

      return acc
    }, initialMetrics)

    return {
      expiredCount: metrics.expiredCount,
      criticalCount: metrics.criticalCount,
      atRiskValue: metrics.atRiskValue,
      expirationChartData: [
        {
          name: 'Vencidos',
          quantidade: metrics.chartBuckets.vencidos,
          color: '#ef4444',
        },
        {
          name: '7 dias',
          quantidade: metrics.chartBuckets.dias7,
          color: '#f59e0b',
        },
        {
          name: '15 dias',
          quantidade: metrics.chartBuckets.dias15,
          color: '#eab308',
        },
        {
          name: '30 dias',
          quantidade: metrics.chartBuckets.dias30,
          color: '#22c55e',
        },
        {
          name: '30+ dias',
          quantidade: metrics.chartBuckets.dias30mais,
          color: '#3b82f6',
        },
      ],
      expiredProducts: metrics.expiredProducts,
      criticalProducts: metrics.criticalProducts,
      warningProducts: metrics.warningProducts,
    }
  }
}
