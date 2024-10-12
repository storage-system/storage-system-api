import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { CategoryFactory } from 'test/factories/make-category'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete category (E2E)', () => {
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

    MainConfig(app)

    await app.init()
  })

  test('[DELETE] /categories/:id', async () => {
    const company = await companyFactory.makePrismaCompany()

    const accessToken = jwt.sign({ sub: company.id.toString() })

    const category = await categoryFactory.makePrismaCategory({
      name: 'category-01',
      companyId: company.id,
      isActive: true,
    })

    const categoryId = category.id

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
