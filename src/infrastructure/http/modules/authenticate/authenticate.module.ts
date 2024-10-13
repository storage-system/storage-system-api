import { GetUserUseCase } from '@/domain/application/user/use-cases/retrieve/get/get-user-use-case'
import { AuthenticateUseCase } from '@/domain/application/authenticate/authenticate-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { AuthenticateController } from './authenticate.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUseCase, GetUserUseCase],
})
export class AuthenticateModule {}
