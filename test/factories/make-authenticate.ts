import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { CompanyFactory } from './make-company'
import { UserFactory } from './make-user'

interface BaseAuthenticateResponse {
  accessToken: string
  userId: string
}

interface AuthenticateWithCompanyResponse extends BaseAuthenticateResponse {
  companyId: string
}

@Injectable()
export class AuthenticateFactory {
  constructor(
    protected jwt: JwtService,
    protected userFactory: UserFactory,
  ) {}

  protected async createUserAndToken(): Promise<BaseAuthenticateResponse> {
    const user = await this.userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = this.jwt.sign({ sub: userId })

    return { accessToken, userId }
  }

  async makePrismaAuthenticate(): Promise<BaseAuthenticateResponse> {
    return this.createUserAndToken()
  }
}

@Injectable()
export class AuthenticateFactoryWithCompany extends AuthenticateFactory {
  constructor(
    jwt: JwtService,
    userFactory: UserFactory,
    private companyFactory: CompanyFactory,
  ) {
    super(jwt, userFactory)
  }

  async makePrismaAuthenticate(): Promise<AuthenticateWithCompanyResponse> {
    const { accessToken, userId } = await this.createUserAndToken()

    const company = await this.companyFactory.makePrismaCompany({
      responsibleId: userId,
    })

    return {
      accessToken,
      userId,
      companyId: company.id.toString(),
    }
  }
}
