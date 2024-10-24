import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryInviteRepository } from 'test/repositories/in-memory-invite-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { CompanyID } from '@/domain/enterprise/company/company'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCompany } from 'test/factories/make-company'
import { makeInvite } from 'test/factories/make-invite'
import { UserID } from '@/domain/enterprise/user/user'
import { makeUser } from 'test/factories/make-user'

import { GetPendingInvitesUseCase } from './get-pending-invites-use-case'
import { GetPendingInvitesOutput } from './pending-invites-output'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let inviteRepository: InviteRepository
let hashGenerator: FakeHasher

let useCase: GetPendingInvitesUseCase

describe('Get Penging Invites Use Case', () => {
  beforeEach(() => {
    companyRepository = new InMemoryCompaniesRepository()
    userRepository = new InMemoryUsersRepository()
    inviteRepository = new InMemoryInviteRepository()
    hashGenerator = new FakeHasher()

    useCase = new GetPendingInvitesUseCase(inviteRepository, companyRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(inviteRepository).toBeDefined()
    expect(hashGenerator).toBeDefined()
  })

  it('should be able to get pending invites', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })
    const companyId = company.id.toString()

    const user = await makeUser({
      repository: userRepository,
      override: {
        companyId: new CompanyID(company.id.toString()),
      },
    })
    const userId = user.id.toString()

    await Promise.all([
      Array.from({ length: 5 }).map(() =>
        makeInvite({
          repository: inviteRepository,
          override: {
            authorId: new UserID(userId),
            companyId: new CompanyID(company.id.toString()),
          },
        }),
      ),
    ])

    const invites = await useCase.execute({ companyId })

    expect(invites).toHaveLength(5)
    expect(invites[0]).toBeInstanceOf(GetPendingInvitesOutput)
  })
})
