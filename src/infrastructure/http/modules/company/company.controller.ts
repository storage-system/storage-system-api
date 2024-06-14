import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { Public } from '@/infrastructure/auth/public'
import {
  Body,
  Controller,
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

@ApiTags('Company')
@Controller('/company')
export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private editCompanyUseCase: EditCompanyUseCase,
    private getCompanyUseCase: GetCompanyUseCase,
  ) { }

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() body: CreateAccountDTO) {
    const { name, email, password, contact, responsible, users } = body

    await this.createCompanyUseCase.execute({
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
}