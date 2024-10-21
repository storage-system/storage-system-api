import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { CreateCategoryDTO } from '../dto/create-category.dto'

describe('Create category (E2E)', () => {
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

    MainConfig(app)

    await app.init()
  })

  test('[POST] /categories/', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const categoryMock: CreateCategoryDTO = {
      name: faker.commerce.productMaterial(),
      isActive: true,
      companyId,
    }

    const response = await request(app.getHttpServer())
      .post(`/categories/`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(categoryMock)

    const categoryId = response.body.categoryId

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    })

    expect(categoryOnDatabase?.name).toBe(categoryMock.name)
    expect(categoryOnDatabase?.isActive).toBe(categoryMock.isActive)
    expect(categoryOnDatabase?.companyId).toBe(categoryMock.companyId)
  })
})
