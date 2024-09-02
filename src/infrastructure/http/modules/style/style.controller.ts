import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";

import { CreateStyleUseCase } from "@/domain/application/style/use-cases/create/create-style-use-case";
import { ListStylesUseCase } from "@/domain/application/style/use-cases/retrieve/list/list-styles-use-case";
import { GetStyleUseCase } from "@/domain/application/style/use-cases/retrieve/get/get-style-use-case";
import { UpdateStyleUseCase } from "@/domain/application/style/use-cases/update/update-style-use-case";
import { DeleteStyleUseCase } from "@/domain/application/style/use-cases/delete/delete-style-use-case";
import { ChooseActiveStyleUseCase } from "@/domain/application/style/use-cases/choose-active-style/choose-active-style-use-case";
import { CreateStyleDTO } from "./dto/create-style.dto";
import { UpdateStyleDTO } from "./dto/update-style.dto";
import { CurrentUser } from "@/infrastructure/decorators/current-user.decorator";
import { UserPayload } from "@/infrastructure/auth/jwt.strategy";
import { QueryParamsDTO } from "../query-params/query-params.dto";

@ApiTags('Styles')
@Controller('/styles')
export class StyleController {
  constructor(
    private createStyleUseCase: CreateStyleUseCase,
    private listStylesUseCase: ListStylesUseCase,
    private getStyleUseCase: GetStyleUseCase,
    private updateStyleUseCase: UpdateStyleUseCase,
    private chooseActiveStyleUseCase: ChooseActiveStyleUseCase,
    private deleteStyleUseCase: DeleteStyleUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() body: CreateStyleDTO) {
    return await this.createStyleUseCase.execute(body)
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async list(
    @Query() query: QueryParamsDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.listStylesUseCase.execute({
      ...query,
      companyId: user.companyId,
    })
  }

  @Get('/:id')
  async getById(
    @Param('id') styleId: string,
  ) {
    return await this.getStyleUseCase.execute({
      styleId,
    })
  }

  @Patch('/:id/active-style')
  @HttpCode(204)
  async chooseActiveStyle(
    @Param('id') styleId: string,
    @CurrentUser() { companyId }: UserPayload,
  ) {
    return await this.chooseActiveStyleUseCase.execute({
      styleId,
      companyId: companyId ?? '',
    })
  }

  @Patch('/:id')
  @HttpCode(204)
  async update(
    @Body() body: UpdateStyleDTO,
    @Param('id') styleId: string,
  ) {
    return await this.updateStyleUseCase.execute({
      styleId,
      ...body
    })
  }

  @Delete('/:id')
  async delete(
    @Param('id') styleId: string,
  ) {
    return await this.deleteStyleUseCase.execute({
      styleId,
    })
  }
}
