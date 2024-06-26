import request from 'supertest'
import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { CompanyFactory } from 'test/factories/make-company'

describe('Update user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory, AuthenticateFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    await app.init()
  })

  test('[PATCH] /users/:id', async () => {
    const { accessToken, userId } = await authenticateFactory.makePrismaAuthenticate()

    const updateUser = {
      name: 'user-updated-01',
    }

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateUser)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: updateUser.name,
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})