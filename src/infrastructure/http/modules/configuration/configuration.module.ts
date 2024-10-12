import { CreateConfigurationUseCase } from '@/domain/application/configuration/use-cases/create/create-configuration-use-case'
import { GetConfigurationUseCase } from '@/domain/application/configuration/use-cases/retrieve/get/get-configuration-use-case'
import { UpdateConfigurationUseCase } from '@/domain/application/configuration/use-cases/update/update-configuration-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { ConfigurationController } from './configuration.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [ConfigurationController],
  providers: [
    CreateConfigurationUseCase,
    GetConfigurationUseCase,
    UpdateConfigurationUseCase,
  ],
})
export class ConfigurationModule {}
