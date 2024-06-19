import { UserRoles } from '@/domain/enterprise/user/user-types'
import { AppModule } from '@/infrastructure/app.module'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /users', async () => {
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8
      }),
      phone: faker.phone.number(),
      roles: [UserRoles.MEMBER],
    }

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userMock)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        name: userMock.name,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})