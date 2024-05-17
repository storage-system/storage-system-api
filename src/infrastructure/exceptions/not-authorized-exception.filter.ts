import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { union } from 'lodash'

import NotAuthorizedException from '@/core/exception/not-authorized-exception'

@Catch(NotAuthorizedException)
export class NotAuthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: NotAuthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      errors: union(
        exception
          .getErrors()
          .map((error) =>
            String(error.message),
          ),
      ),
    })
  }
}
