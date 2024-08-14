import { ProductsRepository } from '../../../products-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCompany } from 'test/factories/make-company'
import { makeCategory } from 'test/factories/make-category'
import { ListProductsUseCase } from './list-products-use-case'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let categoriesRepository: CategoriesRepository
let useCase: ListProductsUseCase

describe('List Products Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new ListProductsUseCase(
      productsRepository,
      companiesRepository,
      categoriesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(productsRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(categoriesRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve products list.', async () => {

    const company = await makeCompany({
      repository: companiesRepository,
    })

    const category = await makeCategory({
      repository: categoriesRepository
    })

    await makeProduct({
      repository: productsRepository,
      override: {
        companyId: company.id,
        categoryIds: [category.id]
      }
    })

    const result = await useCase.execute({
      page: 1,
      perPage: 10,
    })

    expect(result).toBeDefined()
    expect(result.items).toHaveLength(1)
    expect(result.page).toEqual(1)
    expect(result.perPage).toEqual(10)
  })
})
