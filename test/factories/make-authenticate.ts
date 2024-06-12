import { UserFactory } from './make-user'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthenticateFactory {
  constructor(
    private jwt: JwtService,
    private userFactory: UserFactory
  ) {}

  async makePrismaAuthenticate(): Promise<string> {
    const user = await this.userFactory.makePrismaUser()

    const accessToken = this.jwt.sign({ sub: user.id.toString() })

    return accessToken
  }
}