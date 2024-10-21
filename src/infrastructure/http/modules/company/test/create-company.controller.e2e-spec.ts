import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { CreateCompanyDTO } from '../dto/create-company.dto'

describe('Create Company (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AuthenticateFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    MainConfig(app)

    await app.init()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
  })

  test('[POST] /companies', async () => {
    const { accessToken, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const companyMock: CreateCompanyDTO = {
      corporateName: faker.company.name(),
      tradeName: `${faker.company.name()} LTDA`,
      cnpj: faker.string.numeric({ length: 14 }),
      email: faker.internet.email(),
      contact: faker.phone.number(),
      responsibleId: userId,
      address: {
        city: faker.location.city(),
        country: faker.location.country(),
        state: faker.location.state({ abbreviated: true }),
        street: faker.location.street(),
        complement: undefined,
        neighborhood: faker.location.secondaryAddress(),
        number: faker.location.buildingNumber(),
        zipCode: faker.location.zipCode(),
      },
    }

    const response = await request(app.getHttpServer())
      .post('/companies')
      .send(companyMock)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    const companyOnDatabase = await prisma.company.findUnique({
      where: {
        email: companyMock.email,
      },
    })

    expect(companyOnDatabase).toBeTruthy()
  })
})
