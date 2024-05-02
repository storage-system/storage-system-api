import { INestApplication } from '@nestjs/common'
import { NotificationExceptionFilter } from './exceptions/notification-exception.filter'
import { ResourceNotFoundExceptionFilter } from './exceptions/resource-not-found-exception.filter'

export function MainConfig(app: INestApplication) {
  app.useGlobalFilters(
    new NotificationExceptionFilter(),
    new ResourceNotFoundExceptionFilter(),
  )
}
