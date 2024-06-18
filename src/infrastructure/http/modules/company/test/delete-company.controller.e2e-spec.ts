import request from 'supertest'
import { Test } from "@nestjs/testing"
import { UserFactory } from "test/factories/make-user"
import { AppModule } from "@/infrastructure/app.module"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { CompanyFactory } from 'test/factories/make-company'

describe('Delete company (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let companyFactory: CompanyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AuthenticateFactory, CompanyFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    await app.init()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    companyFactory = moduleRef.get(CompanyFactory)
  })

  test('[DELETE] /company/:id', async () => {
    const { accessToken, userId } = await authenticateFactory.makePrismaAuthenticate()
    const company = await companyFactory.makePrismaCompany({
      users: [userId]
    })

    const response = await request(app.getHttpServer())
      .delete(`/company/${company.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)

    const companyOnDatabase = await prisma.company.findFirst({
      where: {
        id: company.id.toString(),
        deletedAt: null,
      }
    })

    expect(companyOnDatabase).toBeNull()
  })
})