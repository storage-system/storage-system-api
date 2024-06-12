import { Module } from "@nestjs/common";
import { CryptographyModule } from "@/infrastructure/cryptography/cryptography.module";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { AuthenticateController } from "./authenticate.controller";
import { AuthenticateUseCase } from "@/domain/application/authenticate/authenticate-use-case";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
  ],
  controllers: [
    AuthenticateController,
  ],
  providers: [
    AuthenticateUseCase,
  ]
})
export class AuthenticateModule { }