import { GetProductUseCase } from './get-product-use-case'
import { ProductsRepository } from '../../../products-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCompany } from 'test/factories/make-company'
import { makeCategory } from 'test/factories/make-category'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let categoriesRepository: CategoriesRepository
let useCase: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new GetProductUseCase(
      productsRepository,
      companiesRepository,
      usersRepository,
      categoriesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(productsRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve product details', async () => {
    const user = await makeUser({
      repository: usersRepository
    })

    const company = await makeCompany({
      repository: companiesRepository,
    })

    const category = await makeCategory({
      repository: categoriesRepository
    })

    const product = await makeProduct({
      repository: productsRepository,
      override: {
        authorId: user.id,
        companyId: company.id,
        categoryIds: [category.id]
      }
    })

    const result = await useCase.execute({
      productId: product.id.toString()
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(product.id.toString())
    expect(result.name).toBe(product.name)
  })
})
