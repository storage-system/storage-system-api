import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'

import { ConfigurationModule } from './modules/configuration/configuration.module'
import { AuthenticateModule } from './modules/authenticate/authenticate.module'
import { CategoryModule } from './modules/category/category.module'
import { CompanyModule } from './modules/company/company.module'
import { ProductModule } from './modules/product/product.module'
import { MetricsModule } from './modules/metrics/metrics.module'
import { StyleModule } from './modules/style/style.module'
import { UserModule } from './modules/user/user.module'
import { FileModule } from './modules/file/file.module'
import { RolesGuard } from '../guards/roles.guard'

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
    UserModule,
    ProductModule,
    ConfigurationModule,
    StyleModule,
    FileModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class HttpModule {}
