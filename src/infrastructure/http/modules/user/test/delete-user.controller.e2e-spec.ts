import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AuthenticateFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    MainConfig(app)

    await app.init()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
  })

  test('[DELETE] /users/:id', async () => {
    const { accessToken, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        id: userId.toString(),
        deletedAt: null,
      },
    })

    expect(userOnDatabase).toBeNull()
  })
})
