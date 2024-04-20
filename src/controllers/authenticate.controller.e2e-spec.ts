import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
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

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const passwordMock = '123456'

    const companyMock = {
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      contact: '99 99999 9999',
      responsible: 'John Doe',
      password: await hash(passwordMock, 8),
    }

    await prisma.company.create({
      data: companyMock,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: companyMock.email,
      password: passwordMock,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})