import {
  Configuration,
  ConfigurationProps,
} from '@/domain/enterprise/configuration/configuration'

export class GetConfigurationOutput {
  id: string
  userId: string
  companyId: string
  daysBeforeOldStock: number
  warningDays: number
  emailNotification: boolean
  systemNotification: boolean
  autoDiscardAfterExpiration: boolean
  freeShippingOnOldStock: boolean
  reportFrequency: string

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(aConfigurationProps: ConfigurationProps & { id: string }) {
    this.id = aConfigurationProps.id.toString()
    this.userId = aConfigurationProps.userId.toString()
    this.companyId = aConfigurationProps.companyId.toString()
    this.daysBeforeOldStock = aConfigurationProps.daysBeforeOldStock
    this.warningDays = aConfigurationProps.warningDays
    this.emailNotification = aConfigurationProps.emailNotification
    this.systemNotification = aConfigurationProps.systemNotification
    this.autoDiscardAfterExpiration =
      aConfigurationProps.autoDiscardAfterExpiration
    this.freeShippingOnOldStock = aConfigurationProps.freeShippingOnOldStock
    this.reportFrequency = aConfigurationProps.reportFrequency

    this.createdAt = aConfigurationProps.createdAt
    this.updatedAt = aConfigurationProps.updatedAt
    this.deletedAt = aConfigurationProps.deletedAt
  }

  static fromAggregate(configuration: Configuration) {
    return new GetConfigurationOutput(configuration.toJSON())
  }
}
