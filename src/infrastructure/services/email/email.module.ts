import { EmailService } from '@/domain/application/services/email-service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'

import { RMQService } from './email.service'

@Global()
@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRoot({
      transport: {
        service: 'QueueTest',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.FROM_EMAIL,
      },
    }),
  ],
  providers: [
    {
      provide: EmailService,
      useClass: RMQService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
