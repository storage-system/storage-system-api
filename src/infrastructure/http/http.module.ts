import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { AuthenticateModule } from "./modules/authenticate/authenticate.module";

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
  ],
})
export class HttpModule { }