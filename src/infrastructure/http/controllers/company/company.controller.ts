import { CompanyAlreadyExistsError } from '@/core/errors/company-already-exists-error'
import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create-company'
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
  constructor(private createCompany: CreateCompanyUseCase) { }

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: CreateAccountBodySchema) {
    const { name, email, password, contact, responsible } = body

    const result = await this.createCompany.execute({
      name,
      email,
      password,
      contact,
      responsible,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CompanyAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}