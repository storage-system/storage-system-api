import { Module } from "@nestjs/common";

import { CreateCompanyUseCase } from "@/domain/application/company/use-cases/create-company-use-case";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { CreateAccountController } from "./company.controller";
import { CryptographyModule } from "@/infrastructure/cryptography/cryptography.module";

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