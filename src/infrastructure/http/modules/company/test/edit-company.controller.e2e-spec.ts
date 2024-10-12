import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Edit Company (E2E)', () => {
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

  test('[PATCH] /companies/:id', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const updateCategory = {
      name: 'Floricultura Floratta',
    }

    const response = await request(app.getHttpServer())
      .patch(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateCategory)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const companyOnDatabase = await prisma.company.findFirst({
      where: {
        name: updateCategory.name,
      },
    })

    expect(companyOnDatabase?.name).toBe(updateCategory.name)
  })
})
