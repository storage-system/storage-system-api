import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ParsePositiveIntPipe } from "../../pipes/parse-positive-int.pipe";

import { CreateUserUseCase } from "@/domain/application/user/use-cases/create/create-user-use-case";
import { DeleteUserUseCase } from "@/domain/application/user/use-cases/delete/delete-user-use-case";
import { ListUsersUseCase } from "@/domain/application/user/use-cases/retrieve/list/list-users-use-case";
import { UpdateUserUseCase } from "@/domain/application/user/use-cases/update/update-user-use-case";
import { Public } from "@/infrastructure/auth/public";

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUserUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) { }

  @Post()
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() body: CreateUserDTO) {
    await this.createUserUseCase.execute(body)
  }
  
  @Get()
  async list(
    @Query('page', new ParsePositiveIntPipe(1)) page: number = 1,
    @Query('perPage', new ParsePositiveIntPipe(10)) perPage: number = 10,
  ) {
    return await this.listUserUseCase.execute({
      page,
      perPage,
    })
  }
  
  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body() body: UpdateUserDTO,
    @Param('id') userId: string,
  ) {
    return await this.updateUserUseCase.execute({
      userId,
      ...body
    })
  }

  @Delete('/:id')
  async delete(
    @Param('id') userId: string,
  ) {
    return await this.deleteUserUseCase.execute({
      userId,
    })
  }
}