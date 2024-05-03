import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import WrongCredentialsException from '@/core/exception/wrong-credentials-exception';

@Catch(WrongCredentialsException)
export class WrongCredentialsExceptionFilter implements ExceptionFilter {
  catch(exception: WrongCredentialsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: exception.message
    });
  }
}
