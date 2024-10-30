import { DatabaseModule } from '@/infrastructure/database/database.module'
import { EmailService } from '@/domain/application/services/email-service'
import { EnvService } from '@/infrastructure/env/env.service'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { connect } from 'amqplib'

import { RMQService } from './rmq.service'
import { RMQConfig } from './rmq.config'

@Global()
@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (env: EnvService) => ({
        uri: new RMQConfig(env).getUri(),
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  providers: [
    {
      provide: EmailService,
      useFactory: async (env: EnvService): Promise<EmailService> => {
        const config = new RMQConfig(env)
        const client = await connect(config.getConfig())
        const channel = await client.createChannel()

        return new RMQService(channel, config, env)
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService],
})
export class RMQModule {}
