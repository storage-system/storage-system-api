import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryInviteRepository } from 'test/repositories/in-memory-invite-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { CompanyID } from '@/domain/enterprise/company/company'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'

import {
  CreateInviteUseCase,
  CreateInviteUseCaseRequest,
} from './create-invite-use-case'

let companyRepository: CompaniesRepository
let userRepository: UsersRepository
let inviteRepository: InviteRepository

let useCase: CreateInviteUseCase

describe('Create Invite Use Case', () => {
  beforeEach(() => {
    companyRepository = new InMemoryCompaniesRepository()
    userRepository = new InMemoryUsersRepository()
    inviteRepository = new InMemoryInviteRepository()

    useCase = new CreateInviteUseCase(userRepository, inviteRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(inviteRepository).toBeDefined()
  })

  it('should be able to create a new invite', async () => {
    const company = await makeCompany({
      repository: companyRepository,
    })

    const user = await makeUser({
      repository: userRepository,
      override: {
        companyId: new CompanyID(company.id.toString()),
      },
    })

    const inviteMock: CreateInviteUseCaseRequest = {
      authorId: user.id.toString(),
      email: faker.internet.email(),
      roles: [UserRoles.MEMBER],
    }

    const { inviteId } = await useCase.execute(inviteMock)

    expect(inviteId).toBeDefined()

    const inviteOnDatabase = await inviteRepository.findById(inviteId)

    expect(inviteOnDatabase?.authorId).toEqual(user.id.toString())
    expect(inviteOnDatabase?.companyId).toEqual(company.id)
    expect(inviteOnDatabase?.accessCode.code).toBeDefined()
  })

  it('should not be able to create a invite that user does not exist', async () => {
    const userNonExists = 'user-id'

    const inviteMock: CreateInviteUseCaseRequest = {
      authorId: userNonExists,
      email: faker.internet.email(),
      roles: [UserRoles.MEMBER],
    }

    expect(useCase.execute(inviteMock)).rejects.toThrowError(
      `Responsável com ID ${userNonExists} não foi encontrado`,
    )
  })
})