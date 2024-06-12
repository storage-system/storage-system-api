import request from 'supertest'
import { Test } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"

describe('Update user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[PATCH] /users/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const updateUser = {
      name: 'user-updated-01',
    }

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .send(updateUser)

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: updateUser.name,
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})