import { Module } from '@nestjs/common'

import { ConfigurationModule } from './modules/configuration/configuration.module'
import { AuthenticateModule } from './modules/authenticate/authenticate.module'
import { EcommerceModule } from './modules/ecommerce/ecommerce.module'
import { CategoryModule } from './modules/category/category.module'
import { CompanyModule } from './modules/company/company.module'
import { MetricsModule } from './modules/metrics/metrics.module'
import { ProductModule } from './modules/product/product.module'
import { InviteModule } from './modules/invite/invite.module'
import { StyleModule } from './modules/style/style.module'
import { FileModule } from './modules/file/file.module'
import { UserModule } from './modules/user/user.module'

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
    InviteModule,
    EcommerceModule,
  ],
  providers: [
    /* {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, */
  ],
})
export class HttpModule {}
