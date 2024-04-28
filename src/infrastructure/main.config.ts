import { INestApplication } from '@nestjs/common'
import { NotificationExceptionFilter } from './exceptions/notification-exception.filter'

export function MainConfig(app: INestApplication) {
  app.useGlobalFilters(
    new NotificationExceptionFilter(),
  )
}
