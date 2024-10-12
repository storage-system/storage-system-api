import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

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
    const { accessToken, companyId, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const removeUsersBody = {
      userIds: [userId],
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
          },
        },
      },
    })

    expect(companyOnDatabase?.users).toEqual([])
  })
})
