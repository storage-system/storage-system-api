import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { EmailModule } from './services/email/email.module'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EmailModule,
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
