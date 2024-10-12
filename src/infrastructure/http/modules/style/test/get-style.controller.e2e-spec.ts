import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { StyleFactory } from 'test/factories/make-style'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Style By Id (E2E)', () => {
  let app: INestApplication
  let authenticateFactory: AuthenticateFactory
  let styleFactory: StyleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        UserFactory,
        AuthenticateFactory,
        StyleFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()

    authenticateFactory = moduleRef.get(AuthenticateFactory)
    styleFactory = moduleRef.get(StyleFactory)

    MainConfig(app)

    await app.init()
  })

  test('[GET] /styles/:styleId', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const style = await styleFactory.makePrismaStyle({
      companyId: new UniqueEntityID(companyId),
    })
    const styleId = style.id

    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/styles/${styleId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(statusCode).toBe(HttpStatus.OK)

    expect(body.id).toBe(styleId.toString())
    expect(body.companyId).toBe(companyId)
    expect(body.name).toBe(style.name)
    expect(body.backgroundColor).toBe(style.backgroundColor)
    expect(body.textColor).toBe(style.textColor)
    expect(body.primaryColor).toBe(style.primaryColor)
    expect(body.secondaryColor).toBe(style.secondaryColor)
    expect(body.tertiaryColor).toBe(style.tertiaryColor)
  })
})
