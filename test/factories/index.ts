import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { Repository } from '@/core/repository'

export type FactoryProp<T, O> = {
  repository?: Repository<T>
  override?: O
}

export type FactoryPropPrisma<O> = {
  prisma?: PrismaService
  override?: O
}
