import { GetCompanyUseCase } from '@/domain/application/company/use-cases/retrieve/get-company/get-company-use-case'
import { RemoveUsersUseCase } from '@/domain/application/company/use-cases/remove-users/remove-users-use-case'
import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { DeleteCompanyUseCase } from '@/domain/application/company/use-cases/delete/delete-company-use-case'
import { AssignUserUseCase } from '@/domain/application/company/use-cases/assign-user/assign-user-use-case'
import { EditCompanyUseCase } from '@/domain/application/company/use-cases/update/edit-company-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { CompanyController } from './company.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CompanyController],
  providers: [
    CreateCompanyUseCase,
    EditCompanyUseCase,
    GetCompanyUseCase,
    DeleteCompanyUseCase,
    AssignUserUseCase,
    RemoveUsersUseCase,
  ],
})
export class CompanyModule {}
