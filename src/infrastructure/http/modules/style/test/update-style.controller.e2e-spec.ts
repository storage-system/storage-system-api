import { AppModule } from '@/infrastructure/app.module'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AuthenticateFactory } from 'test/factories/make-authenticate'
import { UserFactory } from 'test/factories/make-user'
import { CompanyFactory } from 'test/factories/make-company'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StyleFactory } from 'test/factories/make-style'
import { UpdateStyleDTO } from '../dto/update-style.dto'

describe('Update Style (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactory
  let styleFactory: StyleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        AuthenticateFactory,
        StyleFactory,
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactory)
    styleFactory = moduleRef.get(StyleFactory)

    await app.init()
  })

  test('[PATCH] /styles/:id', async () => {
    const { accessToken, companyId, userId } = await authenticateFactory.makePrismaAuthenticate()
    const style = await styleFactory.makePrismaStyle({
      companyId: new UniqueEntityID(companyId)
    })
    const styleId = style.id.toString()

    const updateStyle: UpdateStyleDTO = {
      name: 'updated-style',
      backgroundColor: '#222'
    }

    const response = await request(app.getHttpServer())
      .patch(`/styles/${styleId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateStyle)

    const styleOnDatabase = await prisma.style.findUnique({
      where: {
        id: styleId,
      }
    })

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)
    expect(styleOnDatabase?.id).toBe(styleId)
    expect(styleOnDatabase?.companyId).toBe(companyId)
    expect(styleOnDatabase?.name).toBe(updateStyle.name)
    expect(styleOnDatabase?.backgroundColor).toBe(updateStyle.backgroundColor)
  })
})