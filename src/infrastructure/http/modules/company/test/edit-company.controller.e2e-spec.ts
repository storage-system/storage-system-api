import request from 'supertest'
import { Test } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { AppModule } from "@/infrastructure/app.module"
import { CompanyFactory } from "test/factories/make-company"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"

describe('Edit Company (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let companyFactory: CompanyFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    companyFactory = moduleRef.get(CompanyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /accounts/:id', async () => {
    const company = await companyFactory.makePrismaCompany()

    const accessToken = jwt.sign({ sub: company.id.toString() })

    const updateCategory = {
      name: 'Floricultura Floratta'
    }

    const response = await request(app.getHttpServer())
    .patch(`/accounts/${company.id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(updateCategory)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const companyOnDatabase = await prisma.company.findFirst({
      where: {
        name: updateCategory.name,
      }
    })

    expect(companyOnDatabase?.name).toBe(updateCategory.name)
  })
})