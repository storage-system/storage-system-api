import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class CreateCategoryController {
  constructor() { }

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub)
    return 'ok'
  }
}