import { faker } from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FactoryProp } from "."
import { Configuration, ConfigurationProps, ReportFrequency } from "@/domain/enterprise/configuration/configuration"

export async function makeConfiguration({
  repository,
  override,
}: FactoryProp<
  Configuration,
  Partial<
    ConfigurationProps &
    {
      id: string
    }
  >
> = {}): Promise<Configuration> {
  const configuration = Configuration.create(
    {
      userId: new UniqueEntityID(override?.userId?.toString()),
      companyId: new UniqueEntityID(override?.companyId?.toString()),
      daysBeforeOldStock: faker.number.int({
        min: 1,
        max: 999,
      }),
      warningDays: faker.number.int({
        min: 1,
        max: 999,
      }),
      autoDiscardAfterExpiration: faker.datatype.boolean(),
      emailNotification: faker.datatype.boolean(),
      systemNotification: faker.datatype.boolean(),
      freeShippingOnOldStock: faker.datatype.boolean(),
      reportFrequency: faker.helpers.enumValue(ReportFrequency),
      ...override,
    },
    new UniqueEntityID(override?.id),
  )

  if (repository) {
    await repository.create(configuration)
  }

  return configuration
}