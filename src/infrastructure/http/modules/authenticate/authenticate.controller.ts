import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'
import { AuthenticateCompanyUseCase } from '@/domain/application/authenticate/authenticate-company-use-case'
import { Public } from '@/infrastructure/auth/public'
import { AuthenticateBodySchema, bodyValidationPipe } from './dto/authenticate.dto'

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateCompanyUseCase: AuthenticateCompanyUseCase) { }

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateCompanyUseCase.execute({
      email,
      password,
    })

    return {
      access_token: result.accessToken,
    }
  }
}