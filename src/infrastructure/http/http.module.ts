import { Module } from "@nestjs/common";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { AuthenticateModule } from "./modules/authenticate/authenticate.module";
import { UserModule } from "./modules/user/user.module";
import { ProductModule } from "./modules/product/product.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../guards/roles.guard";
import { ConfigurationModule } from "./modules/configuration/configuration.module";
import { StyleModule } from "./modules/style/style.module";
import { MetricsModule } from "./modules/metrics/metrics.module";

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
    UserModule,
    ProductModule,
    ConfigurationModule,
    StyleModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class HttpModule { }