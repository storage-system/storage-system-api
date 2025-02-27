import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { CreateStyleDTO } from '../dto/create-style.dto'

describe('Create Style (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactoryWithCompany

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory, AuthenticateFactoryWithCompany],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)

    await app.init()
  })

  test('[POST] /styles', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const styleMock: CreateStyleDTO = {
      name: faker.word.adjective(),
      isActive: true,
      backgroundColor: faker.color.rgb(),
      textColor: faker.color.rgb(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      tertiaryColor: faker.color.rgb(),
    }

    const response = await request(app.getHttpServer())
      .post('/styles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(styleMock)

    const styleOnDatabase = await prisma.style.findUnique({
      where: {
        id: response.body.styleId,
      },
    })

    expect(response.statusCode).toBe(HttpStatus.CREATED)
    expect(response.body.styleId).toBeDefined()
    expect(styleOnDatabase).toBeDefined()
    expect(styleOnDatabase?.companyId).toBe(companyId)
    expect(styleOnDatabase?.name).toBe(styleMock.name)
    expect(styleOnDatabase?.isActive).toBe(styleMock.isActive)
    expect(styleOnDatabase?.backgroundColor).toBe(styleMock.backgroundColor)
    expect(styleOnDatabase?.primaryColor).toBe(styleMock.primaryColor)
    expect(styleOnDatabase?.secondaryColor).toBe(styleMock.secondaryColor)
    expect(styleOnDatabase?.tertiaryColor).toBe(styleMock.tertiaryColor)
    expect(styleOnDatabase?.textColor).toBe(styleMock.textColor)
  })
})
