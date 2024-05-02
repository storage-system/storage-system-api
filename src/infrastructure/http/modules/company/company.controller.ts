import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { Public } from '@/infrastructure/auth/public'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { CreateAccountBodySchema, bodyValidationPipe } from './dto/create-account.dto'
import { EditCompanyBodySchema, editCompanyBodyValidationPipe } from './dto/edit-company.dto'
import { EditCompanyUseCase } from '@/domain/application/company/use-cases/update/edit-company-use-case'

@Controller('/accounts')
@Public()
export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private editCompanyUseCase: EditCompanyUseCase
  ) { }

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: CreateAccountBodySchema) {
    const { name, email, password, contact, responsible } = body

     await this.createCompanyUseCase.execute({
      name,
      email,
      password,
      contact,
      responsible,
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body(editCompanyBodyValidationPipe) body: EditCompanyBodySchema,
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