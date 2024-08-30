import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { CreateConfigurationUseCase } from "@/domain/application/configuration/use-cases/create/create-configuration-use-case";
import { GetConfigurationUseCase } from "@/domain/application/configuration/use-cases/retrieve/get/get-configuration-use-case";
import { UpdateConfigurationUseCase } from "@/domain/application/configuration/use-cases/update/update-configuration-use-case";
import { CreateConfigurationDTO } from "./dto/create-configuration.dto";
import { UpdateConfigurationDTO } from "./dto/update-configuration.dto";

@ApiTags('Configurations')
@Controller('/configurations')
export class ConfigurationController {
  constructor(
    private createConfigurationUseCase: CreateConfigurationUseCase,
    private getConfigurationUseCase: GetConfigurationUseCase,
    private updateConfigurationUseCase: UpdateConfigurationUseCase,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateConfigurationDTO) {
    return await this.createConfigurationUseCase.execute(body)
  }

  @Get('/:id')
  async getConfiguration(
    @Param('id') configurationId: string,
  ) {
    return await this.getConfigurationUseCase.execute({
      configurationId,
    })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() body: UpdateConfigurationDTO,
    @Param('id') configurationId: string,
  ) {
    return await this.updateConfigurationUseCase.execute({
      configurationId,
      ...body
    })
  }
}