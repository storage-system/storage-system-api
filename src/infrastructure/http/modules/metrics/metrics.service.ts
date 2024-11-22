import {
  MetricsOutput,
  OldStockMetrics,
  ProductMetrics,
} from '@/domain/enterprise/metrics/metrics-output'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import NotificationException from '@/core/exception/notification-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../../database/prisma/prisma.service'

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async findMetrics(companyId: string): Promise<MetricsOutput> {
    const company = await this.getCompany(companyId)

    const oldStockMetrics = await this.findOldStockMetrics(company.id)
    const productMetrics = await this.findProductMetrics(company.id)

    return {
      oldStockMetrics,
      productMetrics,
    }
  }

  private async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        configuration: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            companyId: true,
            daysBeforeOldStock: true,
            warningDays: true,
            reportFrequency: true,
            autoDiscardAfterExpiration: true,
            systemNotification: true,
            emailNotification: true,
            freeShippingOnOldStock: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID())
    }

    return company
  }

  private async findOldStockMetrics(
    companyId: string,
  ): Promise<OldStockMetrics> {
    const now = new Date()
    const in30Days = new Date(now)
    in30Days.setDate(now.getDate() + 30)

    const in60Days = new Date(now)
    in60Days.setDate(now.getDate() + 60)

    const in90Days = new Date(now)
    in90Days.setDate(now.getDate() + 90)

    const [
      totalProductOldStock,
      totalOldStockValue,
      expiringIn30Days,
      expiringIn60Days,
      expiringIn90Days,
      totalStockQuantity,
    ] = await this.prisma.$transaction([
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId,
          dueDate: {
            lt: now,
          },
        },
      }),
      this.prisma.$queryRaw`
        SELECT SUM(original_price * quantity_in_stock) AS totalOldStockValue
        FROM products
        WHERE deleted_at IS NULL
        AND company_id = ${companyId}
        AND due_date < NOW();
      `,
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId,
          dueDate: {
            gte: now,
            lte: in30Days,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId,
          dueDate: {
            gte: in30Days,
            lte: in60Days,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId,
          dueDate: {
            gte: in60Days,
            lte: in90Days,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          deletedAt: null,
          companyId,
        },
      }),
    ])

    const totalOldStockValueResult = Number(
      (totalOldStockValue as any)[0].totaloldstockvalue,
    )

    const percentageOldStock =
      totalStockQuantity > 0
        ? (totalProductOldStock / totalStockQuantity) * 100
        : 0

    return {
      totalProductOldStock,
      totalOldStockValue: totalOldStockValueResult,
      expiringIn30Days,
      expiringIn60Days,
      expiringIn90Days,
      percentageOldStock,
    }
  }

  private async findProductMetrics(companyId: string): Promise<ProductMetrics> {
    const currentDate = new Date()

    const configuration = await this.prisma.configuration.findFirst({
      where: {
        companyId,
      },
    })

    if (!configuration) {
      throw new NotificationException(
        'Configuração não cadastrada',
        Notification.create(),
      )
    }

    const warningDays = configuration?.warningDays
    const warningDate = new Date()
    warningDate.setDate(currentDate.getDate() + warningDays)

    const [totalStockQuantity, totalStockValue, productsInWarningDays] =
      await this.prisma.$transaction([
        this.prisma.product.count({
          where: {
            deletedAt: null,
            companyId,
            dueDate: {
              gt: currentDate,
            },
          },
        }),
        this.prisma.$queryRaw`
        SELECT SUM(original_price * quantity_in_stock) AS totalStockValue
        FROM products
        WHERE deleted_at IS NULL
        AND company_id = ${companyId}
        AND due_date > NOW();
      `,
        this.prisma.product.count({
          where: {
            deletedAt: null,
            companyId,
            dueDate: {
              lte: warningDate,
              gte: currentDate,
            },
          },
        }),
      ])

    const totalStockValueResult = Number(
      (totalStockValue as any)[0].totalstockvalue,
    )

    return {
      totalStockQuantity,
      totalStockValue: totalStockValueResult,
      productsInWarningDays,
    }
  }
}
