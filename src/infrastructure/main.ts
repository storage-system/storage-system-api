import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { MainConfig } from './main.config';
import { DocumentConfig } from './docs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  MainConfig(app)
  DocumentConfig(app)

  await app.listen(port)
}

bootstrap();
