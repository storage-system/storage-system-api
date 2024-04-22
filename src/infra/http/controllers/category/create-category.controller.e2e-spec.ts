import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create category (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /categories', async () => {
    const companyMock = {
      name: 'John Doe Eletronics',
      email: 'johndoeeletronics@example.com',
      contact: '99 99999 9999',
      responsible: 'John Doe',
      password: '123456',
    }

    const user = await prisma.company.create({
      data: companyMock,
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'category-01',
        isActive: true,
      })

    expect(response.statusCode).toBe(201)

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        name: 'category-01',
      },
    })

    expect(categoryOnDatabase).toBeTruthy()
  })
})