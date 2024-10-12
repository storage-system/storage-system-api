import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { MainConfig } from '@/infrastructure/main.config'
import { AppModule } from '@/infrastructure/app.module'
import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    MainConfig(app)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const passwordMock = '123456'

    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordMock, 8),
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
    }

    await prisma.user.create({
      data: userMock,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: userMock.email,
      password: passwordMock,
    })

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
