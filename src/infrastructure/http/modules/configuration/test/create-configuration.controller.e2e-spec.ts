import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { CreateConfigurationDTO } from '../dto/create-configuration.dto'

describe('Create Configuration (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory, AuthenticateFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)

    await app.init()
  })

  test('[POST] /configurations', async () => {
    const { accessToken, companyId, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const configurationMock: CreateConfigurationDTO = {
      userId,
      companyId,
      daysBeforeOldStock: faker.number.int({
        min: 1,
        max: 999,
      }),
      warningDays: faker.number.int({
        min: 1,
        max: 999,
      }),
      autoDiscardAfterExpiration: faker.datatype.boolean(),
      emailNotification: faker.datatype.boolean(),
      systemNotification: faker.datatype.boolean(),
      freeShippingOnOldStock: faker.datatype.boolean(),
      reportFrequency: faker.helpers.enumValue(ReportFrequency),
    }

    const response = await request(app.getHttpServer())
      .post('/configurations')
      .send(configurationMock)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const configurationOnDatabase = await prisma.configuration.findUnique({
      where: {
        id: response.body.configurationId,
      },
    })

    expect(configurationOnDatabase).toBeDefined()
    expect(configurationOnDatabase?.userId).toBe(userId)
    expect(configurationOnDatabase?.companyId).toBe(companyId)
    expect(configurationOnDatabase?.warningDays).toBe(
      configurationMock.warningDays,
    )
    expect(configurationOnDatabase?.daysBeforeOldStock).toBe(
      configurationMock.daysBeforeOldStock,
    )
  })
})
