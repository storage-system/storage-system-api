import { PrismaService } from "../prisma.service";
import { Configuration } from "@/domain/enterprise/configuration/configuration";
import { PrismaConfigurationMapper } from "../mappers/prisma-configuration-mapper";
import { ConfigurationRepository } from "@/domain/enterprise/configuration/configuration-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaConfigurationRepository implements ConfigurationRepository {
  constructor(private prisma: PrismaService) { }

  async create(record: Configuration): Promise<void> {
    const data = PrismaConfigurationMapper.toPersistence(record)

    await this.prisma.configuration.create({
      data,
    })
  }

  async findById(anId: string): Promise<Configuration | null> {
    const configuration = await this.prisma.configuration.findUnique({
      where: {
        id: anId,
      }
    })

    if (!configuration) {
      return null
    }

    return PrismaConfigurationMapper.toDomain(configuration)
  }

  async update(record: Configuration): Promise<void> {
    const data = PrismaConfigurationMapper.toPersistence(record)

    await this.prisma.configuration.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(anId: string): Promise<void> {
    await this.prisma.configuration.update({
      where: {
        id: anId,
      },
      data: {
        deletedAt: new Date(),
      }
    })
  }
}