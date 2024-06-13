import request from 'supertest'
import { Test } from "@nestjs/testing"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

describe('Assign company (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let companyFactory: CompanyFactory
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, AuthenticateFactory, UserFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    companyFactory = moduleRef.get(CompanyFactory)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    await app.init()
  })

  test('[PATCH] /users/:userId/assign-company/:companyId', async () => {
    const { accessToken, userId } = await authenticateFactory.makePrismaAuthenticate()

    const company = await companyFactory.makePrismaCompany()

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/assign-company/${company.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        companyId: company.id.toString(),
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})