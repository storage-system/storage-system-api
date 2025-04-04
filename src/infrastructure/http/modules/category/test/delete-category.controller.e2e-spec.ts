import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { CompanyID } from '@/domain/enterprise/company/company'
import { CategoryFactory } from 'test/factories/make-category'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete category (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactoryWithCompany
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        AuthenticateFactoryWithCompany,
        CategoryFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    categoryFactory = moduleRef.get(CategoryFactory)

    MainConfig(app)

    await app.init()
  })

  test('[DELETE] /categories/:id', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const category = await categoryFactory.makePrismaCategory({
      companyId: new CompanyID(companyId),
    })
    const categoryId = category.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(HttpStatus.OK)

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        id: categoryId.toString(),
        deletedAt: null,
      },
    })

    expect(categoryOnDatabase).toBeNull()
  })
})
