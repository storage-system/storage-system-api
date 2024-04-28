import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { union } from 'lodash'

import NotificationException from '@/core/exception/notification-exception'

@Catch(NotificationException)
export class NotificationExceptionFilter implements ExceptionFilter {
  catch(exception: NotificationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.aMessage,
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
