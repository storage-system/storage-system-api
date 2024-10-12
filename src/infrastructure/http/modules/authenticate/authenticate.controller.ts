import { AuthenticateUseCase } from '@/domain/application/authenticate/authenticate-use-case'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { Public } from '@/infrastructure/auth/public'
import { ApiTags } from '@nestjs/swagger'

import { AuthenticateDTO } from './dto/authenticate.dto'

@ApiTags('Authenticate')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({
      email,
      password,
    })

    return {
      access_token: result.accessToken,
    }
  }
}
