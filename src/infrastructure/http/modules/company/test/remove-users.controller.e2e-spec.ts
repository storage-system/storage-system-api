import request from 'supertest'
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { AppModule } from "@/infrastructure/app.module"
import { CompanyFactory } from "test/factories/make-company"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UserFactory } from 'test/factories/make-user'
import { MainConfig } from '@/infrastructure/main.config'

describe('Remove Users (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, AuthenticateFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    MainConfig(app)

    await app.init()
  })

  test('[DELETE] /companies/:id/remove-users', async () => {
    const { accessToken, companyId, userId } = await authenticateFactory.makePrismaAuthenticate()

    const removeUsersBody = {
      userIds: [userId]
    }

    const response = await request(app.getHttpServer())
      .delete(`/companies/${companyId}/remove-users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(removeUsersBody)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const companyOnDatabase = await prisma.company.findFirst({
      where: {
        id: companyId,
      },
      include: {
        users: {
          select: {
            id: true,
          }
        },
      }
    })

    expect(companyOnDatabase?.users).toEqual([])
  })
})