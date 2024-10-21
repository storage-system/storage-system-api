import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { CompanyID } from '../company/company'
import { UserID } from '../user/user'

export enum ReportFrequency {
  DIARY = 'diary',
  WEEKLY = 'weekly',
  MONTH = 'month',
  YEAR = 'year',
}

export class ConfigurationID extends UniqueEntityID {}

export interface ConfigurationProps {
  userId: UserID
  companyId: CompanyID
  daysBeforeOldStock: number
  warningDays: number
  emailNotification: boolean
  systemNotification: boolean
  autoDiscardAfterExpiration: boolean
  freeShippingOnOldStock: boolean
  reportFrequency: ReportFrequency
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Configuration extends Entity<ConfigurationProps> {
  static create(
    props: Optional<
      ConfigurationProps,
      'createdAt' | 'daysBeforeOldStock' | 'warningDays'
    >,
    id?: ConfigurationID,
  ) {
    const configuration = new Configuration(
      {
        daysBeforeOldStock: 30,
        warningDays: 15,
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return configuration
  }

  update(aConfiguration: Partial<ConfigurationProps>) {
    this.props.daysBeforeOldStock =
      aConfiguration.daysBeforeOldStock !== undefined
        ? aConfiguration.daysBeforeOldStock
        : this.daysBeforeOldStock

    this.props.warningDays =
      aConfiguration.warningDays !== undefined
        ? aConfiguration.warningDays
        : this.warningDays

    this.props.emailNotification =
      aConfiguration.emailNotification !== undefined
        ? aConfiguration.emailNotification
        : this.emailNotification

    this.props.systemNotification =
      aConfiguration.systemNotification !== undefined
        ? aConfiguration.systemNotification
        : this.systemNotification

    this.props.autoDiscardAfterExpiration =
      aConfiguration.autoDiscardAfterExpiration !== undefined
        ? aConfiguration.autoDiscardAfterExpiration
        : this.autoDiscardAfterExpiration

    this.props.freeShippingOnOldStock =
      aConfiguration.freeShippingOnOldStock !== undefined
        ? aConfiguration.freeShippingOnOldStock
        : this.freeShippingOnOldStock

    this.props.reportFrequency =
      aConfiguration.reportFrequency !== undefined
        ? aConfiguration.reportFrequency
        : this.reportFrequency

    this.touch()
  }

  get userId() {
    return this.props.userId.toString()
  }

  get companyId() {
    return this.props.companyId.toString()
  }

  get daysBeforeOldStock() {
    return this.props.daysBeforeOldStock
  }

  get warningDays() {
    return this.props.warningDays
  }

  get emailNotification() {
    return this.props.emailNotification
  }

  get systemNotification() {
    return this.props.systemNotification
  }

  get autoDiscardAfterExpiration() {
    return this.props.autoDiscardAfterExpiration
  }

  get freeShippingOnOldStock() {
    return this.props.freeShippingOnOldStock
  }

  get reportFrequency() {
    return this.props.reportFrequency
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
