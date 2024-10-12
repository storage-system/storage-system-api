import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'
import { makeCompany } from 'test/factories/make-company'

import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { ListProductsUseCase } from './list-products-use-case'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository
let useCase: ListProductsUseCase

describe('List Products Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new ListProductsUseCase(productsRepository, categoriesRepository)
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
      repository: categoriesRepository,
    })

    await makeProduct({
      repository: productsRepository,
      override: {
        companyId: company.id,
        categoryIds: [category.id],
      },
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
