import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Style } from '@/domain/enterprise/style/style';
import { Prisma, Style as PrismaStyle } from '@prisma/client'

export class PrismaStyleMapper {
  static toDomain(raw: PrismaStyle): Style {
    return Style.create({
      name: raw.name,
      isActive: raw.isActive,
      backgroundColor: raw.backgroundColor,
      textColor: raw.textColor,
      primaryColor: raw.primaryColor,
      secondaryColor: raw.secondaryColor,
      tertiaryColor: raw.tertiaryColor,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      companyId: new UniqueEntityID(raw.companyId),
    }, new UniqueEntityID(raw.id))
  }

  static toPersistence(style: Style): Prisma.StyleUncheckedCreateInput {
    return {
      id: style.id.toString(),
      name: style.name,
      isActive: style.isActive,
      backgroundColor: style.backgroundColor,
      textColor: style.textColor,
      primaryColor: style.primaryColor,
      secondaryColor: style.secondaryColor,
      tertiaryColor: style.tertiaryColor,
      companyId: style.companyId.toString(),
      createdAt: style.createdAt,
      updatedAt: style.updatedAt ?? undefined,
      deletedAt: style.deletedAt ?? undefined,
    }
  }
}