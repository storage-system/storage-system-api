import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'
import { AuthenticateCompanyUseCase } from '@/domain/application/authenticate/authenticate-company-use-case'
import { Public } from '@/infrastructure/auth/public'
import { AuthenticateDTO } from './dto/authenticate.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Authenticate')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateCompanyUseCase: AuthenticateCompanyUseCase) { }

  @Post()
  async handle(@Body() body: AuthenticateDTO) {
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