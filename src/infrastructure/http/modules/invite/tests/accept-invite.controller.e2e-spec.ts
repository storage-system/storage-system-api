import { AuthenticateFactoryWithCompany } from 'test/factories/make-authenticate'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { DatabaseModule } from '@/infrastructure/database/database.module'
import { CompanyID } from '@/domain/enterprise/company/company'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { CompanyFactory } from 'test/factories/make-company'
import { InviteFactory } from 'test/factories/make-invite'
import { AppModule } from '@/infrastructure/app.module'
import { UserFactory } from 'test/factories/make-user'
import { UserID } from '@/domain/enterprise/user/user'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AcceptInviteDTO } from '../dto/accept-invite.dto'

describe('Accept Invite (E2E)', () => {
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
        AuthenticateFactoryWithCompany,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    authenticateFactory = moduleRef.get(AuthenticateFactoryWithCompany)
    inviteFactory = moduleRef.get(InviteFactory)

    await app.init()
  })

  test('[POST] /invites/accept', async () => {
    const { accessToken, userId, companyId } =
      await authenticateFactory.makePrismaAuthenticate()
    const { id: inviteId } = await inviteFactory.makePrismaInvite({
      authorId: new UserID(userId),
      companyId: new CompanyID(companyId),
    })

    const acceptInviteMock: AcceptInviteDTO = {
      inviteId: inviteId.toString(),
      userAccount: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        password: faker.string.alphanumeric({ length: 8 }),
      },
    }

    const response = await request(app.getHttpServer())
      .post('/invites/accept')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(acceptInviteMock)

    const [inviteOnDatabase, newUserOnDatabase] = await prisma.$transaction([
      prisma.invite.findUnique({
        where: {
          id: inviteId.toString(),
        },
      }),
      prisma.user.findUnique({
        where: {
          id: response.body.userId,
        },
      }),
    ])

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(inviteOnDatabase).toBeNull()
    expect(newUserOnDatabase?.companyId).toBe(companyId)
    expect(newUserOnDatabase?.name).toBe(acceptInviteMock.userAccount.name)
    expect(newUserOnDatabase?.phone).toBe(acceptInviteMock.userAccount.phone)
    expect(newUserOnDatabase?.roles).toContain(UserRoles.MEMBER)
  })
})
