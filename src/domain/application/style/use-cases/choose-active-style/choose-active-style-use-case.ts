import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface ChooseActiveStyleUseCaseRequest {
  styleId: string
  companyId: string
}

@Injectable()
export class ChooseActiveStyleUseCase {
  constructor(
    private companyRepository: CompaniesRepository,
    private styleRepository: StyleRepository,
  ) {}

  async execute(props: ChooseActiveStyleUseCaseRequest) {
    await this.ensureCompanyExists(props.companyId)
    const style = await this.getStyleOrThrow(props.styleId)

    await this.deactivateCurrentActiveStyle(props.companyId)

    style.chooseActiveStyle()
    await this.styleRepository.update(style)
  }

  private async ensureCompanyExists(companyId: string) {
    const company = await this.companyRepository.findById(companyId)
    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }
  }

  private async getStyleOrThrow(styleId: string) {
    const style = await this.styleRepository.findById(styleId)
    if (!style) {
      throw ResourceNotFoundException.with(
        'Estilo',
        new UniqueEntityID(styleId),
      )
    }
    return style
  }

  private async deactivateCurrentActiveStyle(companyId: string) {
    const activeStyle =
      await this.styleRepository.findActiveStyleByCompanyId(companyId)
    if (activeStyle) {
      activeStyle.deactivateStyle()
      await this.styleRepository.update(activeStyle)
    }
  }
}
