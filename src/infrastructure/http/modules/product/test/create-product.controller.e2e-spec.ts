import request from 'supertest'
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infrastructure/app.module"
import { CompanyFactory } from "test/factories/make-company"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { DatabaseModule } from "@/infrastructure/database/database.module"
import { PrismaService } from "@/infrastructure/database/prisma/prisma.service"
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UserFactory } from 'test/factories/make-user'
import { MainConfig } from '@/infrastructure/main.config'
import { CreateProductDTO } from '../dto/create-product-dto'
import { faker } from '@faker-js/faker'
import { StatusProduct } from '@/domain/enterprise/product/product'
import { CategoryFactory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('Create Product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        CategoryFactory,
        UserFactory,
        AuthenticateFactory
      ],
    }).compile()
    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    MainConfig(app)

    await app.init()
  })

  test('[POST] /products', async () => {
    const { accessToken, companyId } = await authenticateFactory.makePrismaAuthenticate()

    const category = await categoryFactory.makePrismaCategory({
      name: 'category-01',
      companyId: new UniqueEntityID(companyId),
      isActive: true,
    })

    const productMock: CreateProductDTO = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      originalPrice: faker.number.int({
        max: 200,
        min: 100,
      }),
      discountPercentage: faker.number.int({
        max: 90,
        min: 1,
      }),
      finalPrice: faker.number.int({
        max: 150,
        min: 50,
      }),
      quantityInStock: faker.number.int({
        max: 100,
        min: 0
      }),
      validityInDays: faker.number.int({
        min: 1,
        max: 100,
      }),
      dimensions_depth: faker.string.numeric(2),
      dimensions_height: faker.string.numeric(2),
      dimensions_width: faker.string.numeric(2),
      weight: faker.number.int({
        max: 10,
      }),
      status: StatusProduct.ACTIVE,
      unitOfMeasure: 'kg',
      companyId,
      categoryIds: [category.id.toString()],
    }

    const response = await request(app.getHttpServer())
      .post(`/products`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(productMock)

    console.log('response.body.productId', response.body.productId)

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        id: response.body.productId,
      },
    })

    expect(productOnDatabase).toBeDefined()
    expect(productOnDatabase?.name).toBe(productMock.name)
  })
})