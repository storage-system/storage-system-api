import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { Company } from '@/domain/enterprise/company/company'
import { makeCompany } from 'test/factories/make-company'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'
import { CreateCategoryUseCase } from './create-category-use-case'
import { User } from '@/domain/enterprise/user/user'
import { makeUser } from 'test/factories/make-user'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let categoriesRepository: CategoriesRepository
let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let useCase: CreateCategoryUseCase

describe('Create Category', () => {
  let company: Company
  let author: User

  beforeEach(async () => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    useCase = new CreateCategoryUseCase(
      categoriesRepository,
      companiesRepository,
    )

    company = await makeCompany({
      repository: companiesRepository,
    })

    author = await makeUser({
      repository: usersRepository,
      override: {
        companyId: company.id,
      }
    })
  })

  it('dependencies should be defined', (): void => {
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to create a category', async () => {
    const result = await useCase.execute({
      name: 'category-01',
      isActive: true,
      author
    })

    const categoryOnDatabase = await categoriesRepository.findById(
      result.categoryId,
    )

    expect(result).toBeDefined()
    expect(categoryOnDatabase?.id.toString()).toBe(result.categoryId)
  })

  it('should not be able to create a category if it exist', async () => {
    const categoryMock = {
      name: 'category-01',
      companyId: company.id.toString(),
      isActive: true,
      author,
    }

    await useCase.execute(categoryMock)
    const response = useCase.execute(categoryMock)

    expect(response).rejects.toThrow(
      `Category "${categoryMock.name}" already exists.`,
    )
  })
})
