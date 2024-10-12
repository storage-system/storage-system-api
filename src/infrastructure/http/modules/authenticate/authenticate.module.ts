import { AuthenticateUseCase } from '@/domain/application/authenticate/authenticate-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { AuthenticateController } from './authenticate.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUseCase],
})
export class AuthenticateModule {}
