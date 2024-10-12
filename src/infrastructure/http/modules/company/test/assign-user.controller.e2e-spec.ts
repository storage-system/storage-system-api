import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Assign User (E2E)', () => {
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

    await app.init()
  })

  test('[PATCH] /:id/assign-user', async () => {
    const { accessToken, companyId, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const response = await request(app.getHttpServer())
      .patch(`/companies/${companyId}/assign-user`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const companyOnDatabase = await prisma.company.findUnique({
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

    expect(companyOnDatabase?.users[0].id).toBe(userId)
  })
})
