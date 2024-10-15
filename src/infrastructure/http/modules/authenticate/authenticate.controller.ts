import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthenticateUseCase } from '@/domain/application/authenticate/authenticate-use-case'
import { Public } from '@/infrastructure/auth/public'
import { AuthenticateDTO } from './dto/authenticate.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Authenticate')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) { }

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