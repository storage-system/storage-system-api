import { GetUserUseCase } from '@/domain/application/user/use-cases/retrieve/get/get-user-use-case'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthenticateUseCase } from '@/domain/application/authenticate/authenticate-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { Public } from '@/infrastructure/auth/public'
import { ApiTags } from '@nestjs/swagger'

import { AuthenticateDTO } from './dto/authenticate.dto'

@ApiTags('Authenticate')
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateUseCase: AuthenticateUseCase,
    private getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @Public()
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

  @Get('/me')
  async getById(@CurrentUser() user: UserPayload) {
    const userId = user.sub
    return await this.getUserUseCase.execute({
      userId,
    })
  }
}
