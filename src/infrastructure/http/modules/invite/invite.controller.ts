import { GetPendingInvitesUseCase } from '@/domain/application/invite/get-pending-invites/get-pending-invites-use-case'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { AcceptInviteUseCase } from '@/domain/application/invite/accept/accept-invite-use-case'
import { CreateInviteUseCase } from '@/domain/application/invite/create/create-invite-use-case'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { RevokeInviteUseCase } from './../../../../domain/application/invite/revoke/revoke-invite-use-case'
import { HttpInviteGetResponse } from '../../docs/category/http-invite-get-response'
import { CreateInviteDTO } from './dto/create-invite.dto'
import { AcceptInviteDTO } from './dto/accept-invite.dto'

@ApiTags('Invites')
@Controller('/invites')
export class InviteController {
  constructor(
    private createInviteUseCase: CreateInviteUseCase,
    private acceptInviteUseCase: AcceptInviteUseCase,
    private getPendingInvitesUseCase: GetPendingInvitesUseCase,
    private revokeInviteUseCase: RevokeInviteUseCase,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateInviteDTO) {
    return await this.createInviteUseCase.execute(body)
  }

  @Post('/accept')
  @HttpCode(HttpStatus.OK)
  async accept(@Body() body: AcceptInviteDTO) {
    return await this.acceptInviteUseCase.execute(body)
  }

  @Get('/pendings/company/:companyId')
  @ApiOkResponse({ isArray: true, type: HttpInviteGetResponse })
  async getConfiguration(@Param('companyId') companyId: string) {
    return await this.getPendingInvitesUseCase.execute({
      companyId,
    })
  }

  @Patch('/revoke/:id')
  @HttpCode(HttpStatus.OK)
  async revoke(@Param('id') inviteId: string) {
    return await this.revokeInviteUseCase.execute({
      inviteId,
    })
  }
}
