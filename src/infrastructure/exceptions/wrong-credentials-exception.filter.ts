import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import WrongCredentialsException from '@/core/exception/wrong-credentials-exception'
import { Response } from 'express'

@Catch(WrongCredentialsException)
export class WrongCredentialsExceptionFilter implements ExceptionFilter {
  catch(exception: WrongCredentialsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: exception.message,
    })
  }
}
