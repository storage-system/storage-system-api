import { AppModule } from "@/infrastructure/app.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { MainConfig } from "@/infrastructure/main.config"
import { INestApplication } from "@nestjs/common"
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    MainConfig(app)

    await app.init()
  })

  test('[POST] /companies', async () => {
    const companyMock = {
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      contact: '99 99999 9999',
      responsible: 'John Doe',
      password: '123456',
    }

    const response = await request(app.getHttpServer()).post('/companies').send(companyMock)

    expect(response.statusCode).toBe(201)

    const companyOnDatabase = await prisma.company.findUnique({
      where: {
        email: companyMock.email,
      },
    })

    expect(companyOnDatabase).toBeTruthy()
  })
})