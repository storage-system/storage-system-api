import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import * as morgan from 'morgan'

import { EnvService } from './env/env.service'
import { DocumentConfig } from './docs.config'
import { MainConfig } from './main.config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(EnvService)
  const port = configService.get('PORT')
  const logger = new Logger('Request')

  app.setGlobalPrefix('/api')

  MainConfig(app)
  DocumentConfig(app)

  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.log(message.replace('\n', '')),
      },
    }),
  )

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Starting at http://0.0.0.0:${port}`)
  })
}

bootstrap()
