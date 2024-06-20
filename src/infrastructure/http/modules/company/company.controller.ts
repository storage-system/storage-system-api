import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { Public } from '@/infrastructure/auth/public'
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
  Query,
} from '@nestjs/common'
import { CreateAccountDTO } from './dto/create-account.dto'
import { EditCompanyDTO } from './dto/edit-company.dto'
import { EditCompanyUseCase } from '@/domain/application/company/use-cases/update/edit-company-use-case'
import { ApiTags } from '@nestjs/swagger'
import { GetCompanyUseCase } from '@/domain/application/company/use-cases/retrieve/get-company/get-company-use-case'
import { DeleteCompanyUseCase } from '@/domain/application/company/use-cases/delete/delete-company-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { Roles } from '@/infrastructure/decorators/roles.decorator'
import { UserRoles } from '@/domain/enterprise/user/user-types'

@ApiTags('Company')
@Controller('/companies')
export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private editCompanyUseCase: EditCompanyUseCase,
    private getCompanyUseCase: GetCompanyUseCase,
    private deleteCompanyUseCase: DeleteCompanyUseCase,
  ) { }

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() body: CreateAccountDTO) {
    const { name, email, password, contact, responsible, users } = body

    return await this.createCompanyUseCase.execute({
      name,
      email,
      password,
      contact,
      responsible,
      users,
    })
  }

  @Get('/:companyId')
  async list(
    @Param('companyId') companyId: string
  ) {
    return await this.getCompanyUseCase.execute({
      companyId
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() body: EditCompanyDTO,
    @Param('id') companyId: string
  ) {
    const { name, email, contact, responsible } = body

    await this.editCompanyUseCase.execute({
      companyId,
      name,
      email,
      contact,
      responsible,
    })
  }

  @Delete('/:id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') companyId: string,
    @CurrentUser() user: UserPayload
  ) {
    await this.deleteCompanyUseCase.execute({
      companyId,
      authorId: user.sub,
    })
  }
}