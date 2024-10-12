import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { ConfigurationFactory } from 'test/factories/make-configuration'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Configuration By Id (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let configurationFactory: ConfigurationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        AuthenticateFactory,
        ConfigurationFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    configurationFactory = moduleRef.get(ConfigurationFactory)

    await app.init()
  })

  test('[GET] /configurations/:id', async () => {
    const { accessToken, companyId, userId } =
      await authenticateFactory.makePrismaAuthenticate()
    const configuration = await configurationFactory.makeConfigurationProduct({
      userId: new UniqueEntityID(userId),
      companyId: new UniqueEntityID(companyId),
    })
    const configurationId = configuration.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/configurations/${configurationId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.body.id).toBe(configurationId)
    expect(response.body.userId).toBe(userId)
    expect(response.body.companyId).toBe(companyId)
    expect(response.body.daysBeforeOldStock).toBe(
      configuration.daysBeforeOldStock,
    )
    expect(response.body.reportFrequency).toBe(configuration.reportFrequency)
  })
})
