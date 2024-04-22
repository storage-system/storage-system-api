import { Module } from "@nestjs/common";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { AuthenticateController } from "./authenticate.controller";
import { AuthenticateCompanyUseCase } from "@/domain/application/authenticate/authenticate-company";

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