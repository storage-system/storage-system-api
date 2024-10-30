import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { InviteFactory } from 'test/factories/make-invite'
import { UserID } from '@/domain/enterprise/user/user'
import { CompanyID } from '@/domain/enterprise/company/company'
import { UserRoles } from '@/domain/enterprise/user/user-types'

describe('Pending Invites (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let authenticateFactory: AuthenticateFactoryWithCompany
  let inviteFactory: InviteFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        InviteFactory,
        AuthenticateFactoryWithCompany
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    inviteFactory = moduleRef.get(InviteFactory)

    await app.init()
  })

  test('[GET] /pendings/company/:companyId', async () => {
    const { accessToken, userId, companyId } =
      await authenticateFactory.makePrismaAuthenticate()

    const { email } = await inviteFactory.makePrismaInvite({
      authorId: new UserID(userId),
      companyId: new CompanyID(companyId)
    })

    const response = await request(app.getHttpServer())
      .get(`/invites/pendings/company/${companyId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log('responseBody', response.body)

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.body[0].email).toBe(email)
    expect(response.body[0].roles).toContain(UserRoles.MEMBER)
  })
})
