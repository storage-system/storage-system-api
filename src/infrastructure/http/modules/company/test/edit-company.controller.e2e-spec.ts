import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { EditCompanyDTO } from '../dto/edit-company.dto'

describe('Edit Company (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let companyFactory: CompanyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, AuthenticateFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    companyFactory = moduleRef.get(CompanyFactory)

    await app.init()
  })

  test('[PATCH] /companies/:id', async () => {
    const { accessToken, userId } =
      await authenticateFactory.makePrismaAuthenticate()

    const createdCompany = await companyFactory.makePrismaCompany({
      tradeName: 'Pedro Veras Company',
      corporateName: 'Pedro Veras LTDA',
      email: 'ioj9@gmail.com',
      contact: '62 9969987499',
      cnpj: '81546172000167',
      responsibleId: userId,
      address: {
        city: 'Anápolis',
        country: 'Brazil',
        state: 'GO',
        street: 'Rua Pe. Anchieta',
        neighborhood: 'São Lourenço',
        number: '333',
        zipCode: '75045090',
      },
    })

    const companyId = createdCompany.id.toString()

    const updateCategory: EditCompanyDTO = {
      tradeName: 'Floricultura Floratta',
    }

    const response = await request(app.getHttpServer())
      .patch(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateCategory)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const companyOnDatabase = await prisma.company.findFirst({
      where: {
        id: companyId,
      },
    })

    expect(companyOnDatabase?.tradeName).toBe(updateCategory.tradeName)
  })
})
