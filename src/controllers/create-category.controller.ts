import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class CreateCategoryController {
  constructor() { }

  @Post()
  async handle() {
    return 'ok'
  }
}