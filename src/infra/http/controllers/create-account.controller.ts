import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create-company'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  responsible: z.string(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createCompany: CreateCompanyUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, contact, responsible } = createAccountBodySchema.parse(body)

    const result = await this.createCompany.execute({
      name,
      email,
      password,
      contact,
      responsible,
    })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}