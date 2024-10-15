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
} from '@nestjs/common'
import { GetCompanyUseCase } from '@/domain/application/company/use-cases/retrieve/get-company/get-company-use-case'
import { RemoveUsersUseCase } from '@/domain/application/company/use-cases/remove-users/remove-users-use-case'
import { CreateCompanyUseCase } from '@/domain/application/company/use-cases/create/create-company-use-case'
import { DeleteCompanyUseCase } from '@/domain/application/company/use-cases/delete/delete-company-use-case'
import { AssignUserUseCase } from '@/domain/application/company/use-cases/assign-user/assign-user-use-case'
import { EditCompanyUseCase } from '@/domain/application/company/use-cases/update/edit-company-use-case'
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { Roles } from '@/infrastructure/decorators/roles.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { Public } from '@/infrastructure/auth/public'
import { ApiTags } from '@nestjs/swagger'

import { CreateCompanyDTO } from './dto/create-company.dto'
import { EditCompanyDTO } from './dto/edit-company.dto'
import { RemoveUsersDTO } from './dto/remove-users.dto'

@ApiTags('Company')
@Controller('/companies')
export class CompanyController {
  constructor(
    private createCompanyUseCase: CreateCompanyUseCase,
    private editCompanyUseCase: EditCompanyUseCase,
    private getCompanyUseCase: GetCompanyUseCase,
    private deleteCompanyUseCase: DeleteCompanyUseCase,
    private assignUserUseCase: AssignUserUseCase,
    private removeUsersUseCase: RemoveUsersUseCase,
  ) {}

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() body: CreateCompanyDTO) {
    const { name, email, contact, responsible, users } = body

    return await this.createCompanyUseCase.execute({
      name,
      email,
      contact,
      responsible,
      users,
    })
  }

  @Get('/:companyId')
  async list(@Param('companyId') companyId: string) {
    return await this.getCompanyUseCase.execute({
      companyId,
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: EditCompanyDTO, @Param('id') companyId: string) {
    const { name, email, contact, responsible } = body

    await this.editCompanyUseCase.execute({
      companyId,
      name,
      email,
      contact,
      responsible,
    })
  }

  @Patch('/:id/assign-user')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignUser(
    @CurrentUser() user: UserPayload,
    @Param('id') companyId: string,
  ) {
    await this.assignUserUseCase.execute({
      companyId,
      userId: user.sub,
    })
  }

  @Delete('/:id')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') companyId: string,
    @CurrentUser() user: UserPayload,
  ) {
    await this.deleteCompanyUseCase.execute({
      companyId,
      authorId: user.sub,
    })
  }

  @Delete('/:id/remove-users')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUsers(
    @Param('id') companyId: string,
    @Body() body: RemoveUsersDTO,
  ) {
    await this.removeUsersUseCase.execute({
      companyId,
      userIds: body.userIds,
    })
  }
}
