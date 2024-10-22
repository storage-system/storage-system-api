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
import { faker } from '@faker-js/faker'

import {
  AcceptInviteUseCase,
  AcceptInviteUseCaseRequest,
} from './accept-invite-use-case'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let inviteRepository: InviteRepository
let hashGenerator: FakeHasher

let useCase: AcceptInviteUseCase

describe('Accept Invite Use Case', () => {
  beforeEach(() => {
    companyRepository = new InMemoryCompaniesRepository()
    userRepository = new InMemoryUsersRepository()
    inviteRepository = new InMemoryInviteRepository()
    hashGenerator = new FakeHasher()

    useCase = new AcceptInviteUseCase(
      userRepository,
      inviteRepository,
      hashGenerator,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(inviteRepository).toBeDefined()
    expect(hashGenerator).toBeDefined()
  })

  it('should be able to accept an invite', async () => {
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

    const newUserEmail = faker.internet.email()

    const invite = await makeInvite({
      override: {
        authorId: new UserID(userId),
        companyId: new CompanyID(company.id.toString()),
        email: newUserEmail,
      },
      repository: inviteRepository,
    })

    const inviteId = invite.id.toString()

    const inviteMock: AcceptInviteUseCaseRequest = {
      inviteId,
      userAccount: {
        name: faker.person.fullName(),
        password: faker.string.alphanumeric({
          length: 8,
        }),
        phone: faker.phone.number(),
      },
    }

    const { userId: newUserId } = await useCase.execute(inviteMock)

    const inviteOnDatabase = await inviteRepository.findById(inviteId)

    expect(inviteOnDatabase).toBeNull()

    const hashedPassword = await hashGenerator.hash(
      inviteMock.userAccount.password,
    )

    const userOnDatabase = await userRepository.findById(newUserId)

    expect(userOnDatabase?.companyId?.toString()).toBe(companyId)
    expect(userOnDatabase?.email).toBe(newUserEmail)
    expect(userOnDatabase?.password).toEqual(hashedPassword)
    expect(userOnDatabase?.name).toBe(inviteMock.userAccount.name)
  })
})
