import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

import { CreateUserUseCase } from "@/domain/application/user/use-cases/create/create-user-use-case";
import { DeleteUserUseCase } from "@/domain/application/user/use-cases/delete/delete-user-use-case";
import { ListUsersUseCase } from "@/domain/application/user/use-cases/retrieve/list/list-users-use-case";
import { UpdateUserUseCase } from "@/domain/application/user/use-cases/update/update-user-use-case";
import { Public } from "@/infrastructure/auth/public";
import { AssignCompanyUseCase } from "@/domain/application/user/use-cases/assign-company/assign-company-use-case";
import { ListUsersParamsDTO } from "./dto/list-users.dto";

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUserUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private assignCompanyUseCase: AssignCompanyUseCase,
  ) { }

  @Post()
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() body: CreateUserDTO) {
    await this.createUserUseCase.execute(body)
  }
  
  @Get()
  async list(
    @Query() query: ListUsersParamsDTO
  ) {
    return await this.listUserUseCase.execute(query)
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

  @Patch('/:userId/assign-company/:companyId')
  @HttpCode(204)
  async assignCompany(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    return await this.assignCompanyUseCase.execute({
      userId,
      companyId,
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