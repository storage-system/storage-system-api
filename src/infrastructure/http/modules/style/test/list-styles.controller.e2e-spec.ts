import request from 'supertest'
import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StyleFactory } from 'test/factories/make-style'

describe('List Styles (E2E)', () => {
  let app: INestApplication
  let authenticateFactory: AuthenticateFactory
  let styleFactory: StyleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, AuthenticateFactory, StyleFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    authenticateFactory = moduleRef.get(AuthenticateFactory)
    styleFactory = moduleRef.get(StyleFactory)

    MainConfig(app)

    await app.init()
  })

  test('[GET] /styles', async () => {
    const { accessToken, companyId } = await authenticateFactory.makePrismaAuthenticate()

    await Promise.all([
      styleFactory.makePrismaStyle({
        companyId: new UniqueEntityID(companyId)
      }),
      styleFactory.makePrismaStyle({
        companyId: new UniqueEntityID(companyId)
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