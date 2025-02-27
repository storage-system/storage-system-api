import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ListUsersUseCase } from '@/domain/application/user/use-cases/retrieve/list/list-users-use-case'
import { CreateUserUseCase } from '@/domain/application/user/use-cases/create/create-user-use-case'
import { DeleteUserUseCase } from '@/domain/application/user/use-cases/delete/delete-user-use-case'
import { UpdateUserUseCase } from '@/domain/application/user/use-cases/update/update-user-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { Public } from '@/infrastructure/auth/public'
import { ApiTags } from '@nestjs/swagger'

import { QueryParamsDTO } from '../query-params/query-params.dto'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUserUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDTO) {
    return await this.createUserUseCase.execute(body)
  }

  @Get()
  async list(
    @CurrentUser(CurrentUserPipe) user: UserPayload,
    @Query() query: QueryParamsDTO,
  ) {
    return await this.listUserUseCase.execute({
      ...query,
      companyId: user.companyId,
      roles: user.roles,
    })
  }

  @Patch('/:id')
  @HttpCode(204)
  async update(@Body() body: UpdateUserDTO, @Param('id') userId: string) {
    return await this.updateUserUseCase.execute({
      userId,
      ...body,
    })
  }

  @Delete('/:id')
  async delete(@Param('id') userId: string) {
    return await this.deleteUserUseCase.execute({
      userId,
    })
  }
}
