import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { GetCompanyUseCase } from '@/domain/application/company/use-cases/retrieve/get-company/get-company-use-case'
import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { DeleteCompanyUseCase } from '@/domain/application/company/use-cases/delete/delete-company-use-case'
import { EditCompanyUseCase } from '@/domain/application/company/use-cases/update/edit-company-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { Roles } from '@/infrastructure/decorators/roles.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Public } from '@/infrastructure/auth/public'
import { ApiTags } from '@nestjs/swagger'

import { CurrentUserPipe } from '../../pipes/current-user-pipe'
import { CreateCompanyDTO } from './dto/create-company.dto'
import { EditCompanyDTO } from './dto/edit-company.dto'

@ApiTags('Company')
@Controller('/companies')
export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private editCompanyUseCase: EditCompanyUseCase,
    private getCompanyUseCase: GetCompanyUseCase,
    private deleteCompanyUseCase: DeleteCompanyUseCase,
  ) {}

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() body: CreateCompanyDTO) {
    return await this.createCompanyUseCase.execute(body)
  }

  @Get('/')
  async list(@CurrentUser(CurrentUserPipe) user: UserPayload) {
    return await this.getCompanyUseCase.execute({
      companyId: user.companyId,
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') companyId: string, @Body() body: EditCompanyDTO) {
    await this.editCompanyUseCase.execute({
      ...body,
      companyId,
    })
  }

  @Delete('/:id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') companyId: string,
    @CurrentUser(CurrentUserPipe) user: UserPayload,
  ) {
    await this.deleteCompanyUseCase.execute({
      companyId,
      authorId: user.sub,
    })
  }
}
