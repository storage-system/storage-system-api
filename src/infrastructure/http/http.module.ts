import { Module } from "@nestjs/common";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { AuthenticateModule } from "./modules/authenticate/authenticate.module";
import { UserModule } from "./modules/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../guards/roles.guard";

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class HttpModule { }