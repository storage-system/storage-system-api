import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch users (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, AuthenticateFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    MainConfig(app)

    await app.init()
  })

  test('[GET] /users', async () => {
    const { accessToken } = await authenticateFactory.makePrismaAuthenticate()

    await Promise.all([
      userFactory.makePrismaUser(),
      userFactory.makePrismaUser(),
    ])

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body.items).toHaveLength(3)
    expect(response.body.total).toBe(3)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(10)
  })
})
