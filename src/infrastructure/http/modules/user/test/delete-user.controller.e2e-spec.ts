import request from 'supertest'
import { Test } from "@nestjs/testing"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'

describe('Delete user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AuthenticateFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    await app.init()
  })

  test('[DELETE] /users/:id', async () => {
    const accessToken = await authenticateFactory.makePrismaAuthenticate()

    const user = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        id: user.id.toString(),
        deletedAt: null,
      }
    })

    expect(userOnDatabase).toBeNull()
  })
})