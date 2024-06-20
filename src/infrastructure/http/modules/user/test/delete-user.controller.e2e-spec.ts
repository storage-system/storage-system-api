import request from 'supertest'
import { Test } from "@nestjs/testing"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { MainConfig } from '@/infrastructure/main.config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user.module'
import { CompanyModule } from '../../company/company.module'
import { CompanyFactory } from 'test/factories/make-company'

describe('Delete user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory, AuthenticateFactory],
    }).compile();

    app = moduleRef.createNestApplication()

    MainConfig(app)

    await app.init()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
  })

  test('[DELETE] /users/:id', async () => {
    const { accessToken, userId } = await authenticateFactory.makePrismaAuthenticate()

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        id: userId.toString(),
        deletedAt: null,
      }
    })

    expect(userOnDatabase).toBeNull()
  })
})