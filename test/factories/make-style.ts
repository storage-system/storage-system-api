import { faker } from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FactoryProp } from "."
import { Style, StyleProps } from "@/domain/enterprise/style/style"

export async function makeStyle({
  repository,
  override,
}: FactoryProp<
Style,
  Partial<
  StyleProps &
    {
      id: string
    }
  >
> = {}): Promise<Style> {
  const style = Style.create(
    {
      companyId: new UniqueEntityID(override?.companyId?.toString()),
      name: faker.word.adjective(),
      backgroundColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
      ...override,
    },
    new UniqueEntityID(override?.id),
  )

  if (repository) {
    await repository.create(style)
  }

  return style
}