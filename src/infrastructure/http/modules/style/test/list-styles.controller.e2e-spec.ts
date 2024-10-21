import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { StyleFactory } from 'test/factories/make-style'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('List Styles (E2E)', () => {
  let app: INestApplication
  let authenticateFactory: AuthenticateFactoryWithCompany
  let styleFactory: StyleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        UserFactory,
        AuthenticateFactoryWithCompany,
        StyleFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()

    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    styleFactory = moduleRef.get(StyleFactory)

    MainConfig(app)

    await app.init()
  })

  test('[GET] /styles', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    await Promise.all([
      styleFactory.makePrismaStyle({
        companyId: new UniqueEntityID(companyId),
      }),
      styleFactory.makePrismaStyle({
        companyId: new UniqueEntityID(companyId),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/styles`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body.items).toHaveLength(2)
    expect(response.body.total).toBe(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(10)
  })
})
