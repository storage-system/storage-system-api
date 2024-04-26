import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { CategoryFactory } from "test/factories/make-category"
import { CompanyFactory } from "test/factories/make-company"
import request from 'supertest'

describe('Fetch categories (E2E)', () => {
  let app: INestApplication
  let companyFactory: CompanyFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    companyFactory = moduleRef.get(CompanyFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /categories', async () => {
    const company = await companyFactory.makePrismaCompany()

    const accessToken = jwt.sign({ sub: company.id.toString() })

    await Promise.all([
      categoryFactory.makePrismaCategory({
        name: 'category-01',
        companyId: company.id,
        isActive: true,
      }),
      categoryFactory.makePrismaCategory({
        name: 'category-02',
        companyId: company.id,
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