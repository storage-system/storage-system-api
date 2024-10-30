import {
  EmailMessage,
  EmailService,
} from '@/domain/application/services/email-service'
import { EnvService } from '@/infrastructure/env/env.service'
import { Logger } from '@nestjs/common'
import { Channel } from 'amqplib'

import { RMQConfig } from './rmq.config'

export class RMQService implements EmailService {
  constructor(
    private channel: Channel,
    private rmqConfig: RMQConfig,
    private envService: EnvService,
  ) {
    Logger.log(`${RMQService.name} initialized successfully`, RMQService.name)
  }

  async send(message: EmailMessage): Promise<void> {
    const from = 'veraspedro1608@gmail.com'

    const buffer = Buffer.from(
      JSON.stringify({
        data: {
          ...message,
          from,
        },
        pattern: 'EMAIL-TESTE',
      }),
    )

    const emailSent = this.channel.sendToQueue(this.rmqConfig.queue, buffer)

    if (!emailSent) {
      Logger.error('Email not sent', RMQService.name)
    }
  }
}
