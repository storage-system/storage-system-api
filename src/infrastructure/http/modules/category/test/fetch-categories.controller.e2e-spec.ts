import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { CompanyID } from '@/domain/enterprise/company/company'
import { CategoryFactory } from 'test/factories/make-category'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch categories (E2E)', () => {
  let app: INestApplication
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

    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    categoryFactory = moduleRef.get(CategoryFactory)

    MainConfig(app)

    await app.init()
  })

  test('[GET] /categories', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    await Promise.all([
      categoryFactory.makePrismaCategory({
        name: 'category-01',
        companyId: new CompanyID(companyId),
        isActive: true,
      }),
      categoryFactory.makePrismaCategory({
        name: 'category-02',
        companyId: new CompanyID(companyId),
        isActive: true,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.items).toHaveLength(2)
    expect(response.body.total).toBe(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(10)
  })
})
