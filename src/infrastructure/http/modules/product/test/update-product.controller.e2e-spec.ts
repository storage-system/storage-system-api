import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { ProductFactory } from 'test/factories/make-product'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { UpdateProductDTO } from '../dto/update-product-dto'

describe('Update product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let productFactory: ProductFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        UserFactory,
        AuthenticateFactory,
        ProductFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    productFactory = moduleRef.get(ProductFactory)

    MainConfig(app)

    await app.init()
  })

  test('[PATCH] /products/:productId', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const productMock = await productFactory.makePrismaProduct({
      companyId: new UniqueEntityID(companyId),
    })

    const productId = productMock.id.toString()

    const updateProductBody: UpdateProductDTO = {
      name: faker.commerce.productName(),
    }

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateProductBody)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    })

    expect(productOnDatabase?.id).toBe(productId)
    expect(productOnDatabase?.name).toBe(updateProductBody.name)
  })
})
