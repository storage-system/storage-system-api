import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CategoryModule } from "./controllers/category/category.module";
import { CompanyModule } from "./controllers/company/company.module";
import { AuthenticateModule } from "./controllers/authenticate/authenticate.module";

@Module({
  imports: [
    AuthenticateModule,
    CompanyModule,
    CategoryModule,
  ],
})
export class HttpModule { }