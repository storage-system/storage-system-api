import { NestFactory } from '@nestjs/core'

import { EnvService } from './env/env.service'
import { DocumentConfig } from './docs.config'
import { MainConfig } from './main.config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  app.setGlobalPrefix('/api')

  MainConfig(app)
  DocumentConfig(app)

  await app.listen(port)
}

bootstrap()
