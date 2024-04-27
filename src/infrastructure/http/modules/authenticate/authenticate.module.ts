import { Module } from "@nestjs/common";
import { CryptographyModule } from "@/infrastructure/cryptography/cryptography.module";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { AuthenticateController } from "./authenticate.controller";
import { AuthenticateCompanyUseCase } from "@/domain/application/authenticate/authenticate-company-use-case";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
  ],
  controllers: [
    AuthenticateController,
  ],
  providers: [
    AuthenticateCompanyUseCase,
  ]
})
export class AuthenticateModule { }