import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryInviteRepository } from 'test/repositories/in-memory-invite-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { CompanyID } from '@/domain/enterprise/company/company'
import { makeCompany } from 'test/factories/make-company'
import { makeInvite } from 'test/factories/make-invite'
import { UserID } from '@/domain/enterprise/user/user'
import { makeUser } from 'test/factories/make-user'

import { RevokeInviteUseCase } from './revoke-invite-use-case'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let inviteRepository: InviteRepository

let useCase: RevokeInviteUseCase

describe('Revoke Invite Use Case', () => {
  beforeEach(() => {
    companyRepository = new InMemoryCompaniesRepository()
    userRepository = new InMemoryUsersRepository()
    inviteRepository = new InMemoryInviteRepository()

    useCase = new RevokeInviteUseCase(inviteRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(inviteRepository).toBeDefined()
  })

  it('should be able to revoke an invite', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })
    const companyId = company.id.toString()

    const user = await makeUser({
      repository: userRepository,
      override: {
        companyId: new CompanyID(companyId),
      },
    })
    const userId = user.id.toString()

    const invite = await makeInvite({
      override: {
        authorId: new UserID(userId),
        companyId: new CompanyID(company.id.toString()),
      },
      repository: inviteRepository,
    })

    const inviteId = invite.id.toString()

    await useCase.execute({ inviteId })

    const inviteOnDatabase = await inviteRepository.findById(inviteId)

    expect(inviteOnDatabase?.deletedAt).toBeDefined()
  })
})
