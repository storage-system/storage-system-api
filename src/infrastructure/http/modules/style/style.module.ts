import { ChooseActiveStyleUseCase } from '@/domain/application/style/use-cases/choose-active-style/choose-active-style-use-case'
import { ListStylesUseCase } from '@/domain/application/style/use-cases/retrieve/list/list-styles-use-case'
import { CreateStyleUseCase } from '@/domain/application/style/use-cases/create/create-style-use-case'
import { GetStyleUseCase } from '@/domain/application/style/use-cases/retrieve/get/get-style-use-case'
import { UpdateStyleUseCase } from '@/domain/application/style/use-cases/update/update-style-use-case'
import { DeleteStyleUseCase } from '@/domain/application/style/use-cases/delete/delete-style-use-case'
import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { Module } from '@nestjs/common'

import { StyleController } from './style.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [StyleController],
  providers: [
    CreateStyleUseCase,
    ListStylesUseCase,
    GetStyleUseCase,
    UpdateStyleUseCase,
    ChooseActiveStyleUseCase,
    DeleteStyleUseCase,
  ],
})
export class StyleModule {}
