import { EnvService } from '@/infrastructure/env/env.service'
import { Inject } from '@nestjs/common'
import { type Options } from 'amqplib'

export class RMQConfig {
  port: number
  hostname: string
  password: string
  username: string
  queue: string

  constructor(
    @Inject(EnvService)
    private readonly env: EnvService,
  ) {
    this.port = Number(env.get('RMQ_MESSAGING_PORT'))
    this.hostname = env.get('RMQ_MESSAGING_HOST')
    this.password = env.get('RMQ_MESSAGING_PASSWORD')
    this.username = env.get('RMQ_MESSAGING_USER')
    this.queue = env.get('EMAIL_MESSAGING_QUEUE')
  }

  getUri(): string {
    return `amqp://${this.username}:${this.password}@${this.hostname}:${this.port}/`
  }

  getConfig(): Options.Connect {
    return {
      hostname: this.hostname,
      port: this.port,
      username: this.username,
      password: this.password,
    }
  }
}
