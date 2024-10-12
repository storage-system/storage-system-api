import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import NotAuthorizedException from '@/core/exception/not-authorized-exception'
import { Response } from 'express'
import { union } from 'lodash'

@Catch(NotAuthorizedException)
export class NotAuthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: NotAuthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      errors: union(
        exception.getErrors().map((error) => String(error.message)),
      ),
    })
  }
}
