import { ListUsersUseCase } from '@/domain/application/user/use-cases/retrieve/list/list-users-use-case'
import { CreateUserUseCase } from '@/domain/application/user/use-cases/create/create-user-use-case'
import { UpdateUserUseCase } from '@/domain/application/user/use-cases/update/update-user-use-case'
import { DeleteUserUseCase } from '@/domain/application/user/use-cases/delete/delete-user-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { UserController } from './user.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
