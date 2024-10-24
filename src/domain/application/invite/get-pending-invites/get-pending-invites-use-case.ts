import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { CompanyID } from '@/domain/enterprise/company/company'
import { Injectable } from '@nestjs/common'

import { GetPendingInvitesOutput } from './pending-invites-output'

export interface GetPendingInvitesUseCaseRequest {
  companyId: string
}

export type GetPendingInvitesUseCaseResponse = GetPendingInvitesOutput[]

@Injectable()
export class GetPendingInvitesUseCase {
  constructor(
    private inviteRepository: InviteRepository,
    private companyRepository: CompaniesRepository,
  ) {}

  async execute({
    companyId,
  }: GetPendingInvitesUseCaseRequest): Promise<GetPendingInvitesUseCaseResponse> {
    const company = await this.companyRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new CompanyID(companyId))
    }

    const invites = await this.inviteRepository.getPendings(companyId)

    return invites.map(GetPendingInvitesOutput.fromAggregate)
  }
}
