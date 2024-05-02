import { Response } from 'express';
import ResourceNotFoundException from '@/core/exception/not-found-exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch(ResourceNotFoundException)
export class ResourceNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: ResourceNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message
    });
  }
}
