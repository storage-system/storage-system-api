import { CompanyAlreadyExistsError } from '@/core/errors/company-already-exists-error'
import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create-company-use-case'
import { Public } from '@/infrastructure/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CreateAccountBodySchema, bodyValidationPipe } from './dto/create-account.dto'

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private createCompanyUseCase: CreateCompanyUseCase) { }

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: CreateAccountBodySchema) {
    const { name, email, password, contact, responsible } = body

    return await this.createCompanyUseCase.execute({
      name,
      email,
      password,
      contact,
      responsible,
    })
  }
}