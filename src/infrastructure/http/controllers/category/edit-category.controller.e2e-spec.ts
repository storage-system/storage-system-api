import { AppModule } from "@/infrastructure/app.module"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { CategoryFactory } from "test/factories/make-category"
import { CompanyFactory } from "test/factories/make-company"
import request from 'supertest'
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"

describe('Edit category (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let companyFactory: CompanyFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    companyFactory = moduleRef.get(CompanyFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /categories/:id', async () => {
    const company = await companyFactory.makePrismaCompany()

    const accessToken = jwt.sign({ sub: company.id.toString() })

    const category = await categoryFactory.makePrismaCategory({
      name: 'category-01',
      companyId: company.id,
      isActive: true,
    })

    const categoryId = category.id

    const updateCategory = {
      name: 'new-category-01',
      isActive: true,
    }

    const response = await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateCategory)

    expect(response.statusCode).toBe(204)

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        name: updateCategory.name,
        isActive: updateCategory.isActive,
      }
    })

    expect(categoryOnDatabase).toBeTruthy()
  })
})