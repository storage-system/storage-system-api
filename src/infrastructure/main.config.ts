import { INestApplication } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { ResourceNotFoundExceptionFilter } from './exceptions/resource-not-found-exception.filter'
import { WrongCredentialsExceptionFilter } from './exceptions/wrong-credentials-exception.filter'
import { NotificationExceptionFilter } from './exceptions/notification-exception.filter'

export function MainConfig(app: INestApplication) {
  app.enableCors()
  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalFilters(
    new NotificationExceptionFilter(),
    new ResourceNotFoundExceptionFilter(),
    new WrongCredentialsExceptionFilter(),
  )
}
