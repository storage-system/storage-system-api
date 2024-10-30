import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { CreateInviteDTO } from '../dto/create-invite.dto'

describe('Create Invite (E2E)', () => {
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

    await app.init()
  })

  test('[POST] /invites', async () => {
    const { accessToken, userId, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const inviteMock: CreateInviteDTO = {
      authorId: userId,
      email: faker.internet.email(),
    }

    const response = await request(app.getHttpServer())
      .post('/invites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(inviteMock)

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const inviteOnDatabase = await prisma.invite.findUnique({
      where: {
        id: response.body.inviteId,
      },
    })

    expect(inviteOnDatabase?.companyId).toBe(companyId)
    expect(inviteOnDatabase?.authorId).toBe(userId)
    expect(inviteOnDatabase?.email).toBe(inviteMock.email)
  })
})
