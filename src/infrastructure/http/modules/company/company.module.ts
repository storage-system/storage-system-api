import { Module } from "@nestjs/common";

import { CreateCompanyUseCase } from "@/domain/application/company/use-cases/create/create-company-use-case";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { CompanyController } from "./company.controller";
import { CryptographyModule } from "@/infrastructure/cryptography/cryptography.module";
import { EditCompanyUseCase } from "@/domain/application/company/use-cases/update/edit-company-use-case";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CompanyController,
  ],
  providers: [
    CreateCompanyUseCase,
    EditCompanyUseCase,
  ]
})
export class CompanyModule { }