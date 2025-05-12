import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { INestApplication } from '@nestjs/common'
import { patchNestJsSwagger } from 'nestjs-zod'
import { Request, Response } from 'express'

export function DocumentConfig(app: INestApplication): void {
  patchNestJsSwagger()

  const apiInfo = new DocumentBuilder()
    .setTitle('Storage System - Rest API')
    .setVersion('v1')
    .setDescription(
      'API Rest da aplicação responsável por controlar estoque velho de uma empresa. Storage system',
    )
    .setLicense(
      'Apache License 2.0',
      'http://www.apache.org/licenses/LICENSE-2.0',
    )
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, apiInfo)

  if (process.env.NODE_ENV === 'production') {
    return
  }

  app.getHttpAdapter().get('/docs/json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    return res.send(document)
  })

  app.use(
    '/docs',

    apiReference({
      theme: 'elysiajs',
      spec: {
        content: document,
      },
      metaData: {
        title: 'Storage System - Rest API',
      },
    }),
  )
}
