import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthenticateCompanyUseCase } from '@/domain/application/authenticate/authenticate-company-use-case'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
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

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}