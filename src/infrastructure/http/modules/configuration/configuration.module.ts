import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infrastructure/database/database.module";
import { CryptographyModule } from "@/infrastructure/cryptography/cryptography.module";
import { ConfigurationController } from "./configuration.controller";
import { CreateConfigurationUseCase } from "@/domain/application/configuration/use-cases/create/create-configuration-use-case";
import { GetConfigurationUseCase } from "@/domain/application/configuration/use-cases/retrieve/get/get-configuration-use-case";
import { UpdateConfigurationUseCase } from "@/domain/application/configuration/use-cases/update/update-configuration-use-case";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    ConfigurationController,
  ],
  providers: [
    CreateConfigurationUseCase,
    GetConfigurationUseCase,
    UpdateConfigurationUseCase,
  ]
})
export class ConfigurationModule { }