import { INestApplication } from '@nestjs/common'
import { NotificationExceptionFilter } from './exceptions/notification-exception.filter'
import { ResourceNotFoundExceptionFilter } from './exceptions/resource-not-found-exception.filter'
import { WrongCredentialsExceptionFilter } from './exceptions/wrong-credentials-exception.filter'
import { ZodValidationPipe } from 'nestjs-zod';

export function MainConfig(app: INestApplication) {
  app.enableCors();
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalFilters(
    new NotificationExceptionFilter(),
    new ResourceNotFoundExceptionFilter(),
    new WrongCredentialsExceptionFilter(),
  )
}
