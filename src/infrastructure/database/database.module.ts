import { StockMovementsRepository } from '@/domain/enterprise/stock-movement/stock-movement-repository'
import { ConfigurationRepository } from '@/domain/enterprise/configuration/configuration-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { ProductsRepository } from '@/domain/enterprise/product/products-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { Module } from '@nestjs/common'

import { PrismaStockMovementsRepository } from './prisma/repositories/prisma-stock-movement-repository'
import { PrismaConfigurationRepository } from './prisma/repositories/prisma-configuration-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-category-repository'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-company-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-product-repository'
import { PrismaInviteRepository } from './prisma/repositories/prisma-invite-repository'
import { PrismaStyleRepository } from './prisma/repositories/prisma-style-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository'
import { PrismaFileRepository } from './prisma/repositories/prisma-file-repository'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: ConfigurationRepository,
      useClass: PrismaConfigurationRepository,
    },
    {
      provide: StyleRepository,
      useClass: PrismaStyleRepository,
    },
    {
      provide: FileRepository,
      useClass: PrismaFileRepository,
    },
    {
      provide: InviteRepository,
      useClass: PrismaInviteRepository,
    },
    {
      provide: StockMovementsRepository,
      useClass: PrismaStockMovementsRepository,
    },
  ],
  exports: [
    PrismaService,
    CategoriesRepository,
    CompaniesRepository,
    UsersRepository,
    ProductsRepository,
    ConfigurationRepository,
    StyleRepository,
    FileRepository,
    InviteRepository,
    StockMovementsRepository,
  ],
})
export class DatabaseModule {}
