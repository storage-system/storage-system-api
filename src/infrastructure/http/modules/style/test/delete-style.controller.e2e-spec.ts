import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { StyleFactory } from 'test/factories/make-style'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete Style (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactoryWithCompany
  let styleFactory: StyleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        AuthenticateFactoryWithCompany,
        StyleFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    styleFactory = moduleRef.get(StyleFactory)

    await app.init()
  })

  test('[DELETE] /styles/:id', async () => {
    const { accessToken, companyId } =
      await authenticateFactory.makePrismaAuthenticate()
    const style = await styleFactory.makePrismaStyle({
      companyId: new UniqueEntityID(companyId),
    })
    const styleId = style.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/styles/${styleId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const styleOnDatabase = await prisma.style.findUnique({
      where: {
        id: styleId,
      },
    })

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)
    expect(styleOnDatabase?.deletedAt).toBeDefined()
  })
})
