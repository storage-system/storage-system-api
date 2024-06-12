import { Module } from "@nestjs/common";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { AuthenticateModule } from "./modules/authenticate/authenticate.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
    UserModule,
  ],
})
export class HttpModule { }