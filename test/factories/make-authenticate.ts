import { UserFactory } from './make-user'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CompanyFactory } from './make-company'

interface AuthenticateFactoryResponse {
  accessToken: string
  userId: string
  companyId: string
}

@Injectable()
export class AuthenticateFactory {
  constructor(
    private jwt: JwtService,
    private userFactory: UserFactory,
    private companyFactory: CompanyFactory
  ) { }

  async makePrismaAuthenticate(): Promise<AuthenticateFactoryResponse> {
    const company = await this.companyFactory.makePrismaCompany()
    const user = await this.userFactory.makePrismaUser({
      companyId: company.id,
    })

    const accessToken = this.jwt.sign({ sub: user.id.toString() })

    return {
      accessToken,
      userId: user.id.toString(),
      companyId: company.id.toString()
    }
  }
}