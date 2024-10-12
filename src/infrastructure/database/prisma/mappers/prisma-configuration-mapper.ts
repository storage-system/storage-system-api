import {
  Configuration,
  ReportFrequency,
} from '@/domain/enterprise/configuration/configuration'
import { Prisma, Configuration as PrismaConfiguration } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaConfigurationMapper {
  static toDomain(raw: PrismaConfiguration): Configuration {
    return Configuration.create(
      {
        daysBeforeOldStock: raw.daysBeforeOldStock,
        warningDays: raw.warningDays,
        autoDiscardAfterExpiration: raw.autoDiscardAfterExpiration,
        emailNotification: raw.emailNotification,
        systemNotification: raw.systemNotification,
        freeShippingOnOldStock: raw.freeShippingOnOldStock,
        reportFrequency: raw.reportFrequency as ReportFrequency,
        userId: new UniqueEntityID(raw.userId),
        companyId: new UniqueEntityID(raw.companyId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    configuration: Configuration,
  ): Prisma.ConfigurationUncheckedCreateInput {
    return {
      id: configuration.id.toString(),
      daysBeforeOldStock: configuration.daysBeforeOldStock,
      warningDays: configuration.warningDays,
      autoDiscardAfterExpiration: configuration.autoDiscardAfterExpiration,
      emailNotification: configuration.emailNotification,
      systemNotification: configuration.systemNotification,
      freeShippingOnOldStock: configuration.freeShippingOnOldStock,
      reportFrequency: configuration.reportFrequency,
      companyId: configuration.companyId.toString(),
      userId: configuration.userId.toString(),
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt,
      deletedAt: configuration.deletedAt,
    }
  }
}
