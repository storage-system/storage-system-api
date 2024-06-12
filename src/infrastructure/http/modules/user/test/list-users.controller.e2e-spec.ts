import request from 'supertest'
import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"

describe('Fetch users (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[GET] /users', async () => {
    await Promise.all([
      userFactory.makePrismaUser(),
      userFactory.makePrismaUser(),
    ])

    const response = await request(app.getHttpServer())
      .get('/users')
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.items).toHaveLength(2)
    expect(response.body.total).toBe(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(10)
  })
})