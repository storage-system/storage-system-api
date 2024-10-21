import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { ConfigurationFactory } from 'test/factories/make-configuration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UpdateConfigurationDTO } from '../dto/update-configuration.dto'

describe('Update Configuration (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactoryWithCompany
  let configurationFactory: ConfigurationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        AuthenticateFactoryWithCompany,
        ConfigurationFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    configurationFactory = moduleRef.get(ConfigurationFactory)

    await app.init()
  })

  test('[PATCH] /configurations/:id', async () => {
    const { accessToken, userId, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const configuration = await configurationFactory.makeConfigurationProduct({
      userId: new UniqueEntityID(userId),
      companyId: new UniqueEntityID(companyId),
    })
    const configurationId = configuration.id.toString()

    const updateConfiguration: UpdateConfigurationDTO = {
      daysBeforeOldStock: 90,
      warningDays: 90,
      reportFrequency: ReportFrequency.YEAR,
    }

    const response = await request(app.getHttpServer())
      .patch(`/configurations/${configurationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateConfiguration)

    const configurationOnDatabase = await prisma.configuration.findUnique({
      where: {
        id: configurationId,
      },
    })

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)
    expect(configurationOnDatabase?.id).toBe(configurationId)
    expect(configurationOnDatabase?.userId).toBe(userId)
    expect(configurationOnDatabase?.companyId).toBe(companyId)
    expect(configurationOnDatabase?.daysBeforeOldStock).toBe(
      updateConfiguration.daysBeforeOldStock,
    )
    expect(configurationOnDatabase?.reportFrequency).toBe(
      updateConfiguration.reportFrequency,
    )
  })
})
