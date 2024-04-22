import { Module } from "@nestjs/common";

import { CreateCompanyUseCase } from "@/domain/application/company/use-cases/create-company";
import { DatabaseModule } from "@/infra/database/database.module";
import { CreateAccountController } from "./create-account.controller";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
  ],
  providers: [
    CreateCompanyUseCase,
  ]
})
export class CompanyModule { }