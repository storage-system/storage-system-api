import { PrismaStyleMapper } from '@/infrastructure/database/prisma/mappers/prisma-style-mapper'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { Style, StyleProps } from '@/domain/enterprise/style/style'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeStyle({
  repository,
  override,
}: FactoryProp<
  Style,
  Partial<
    StyleProps & {
      id: string
    }
  >
> = {}): Promise<Style> {
  const style = Style.create(
    {
      companyId: new UniqueEntityID(override?.companyId?.toString()),
      isActive: faker.datatype.boolean(),
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

@Injectable()
export class StyleFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStyle(data: Partial<StyleProps> = {}): Promise<Style> {
    const style = await makeStyle({ override: data })

    await this.prisma.style.create({
      data: PrismaStyleMapper.toPersistence(style),
    })

    return style
  }
}
