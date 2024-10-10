import { GetProductUseCase } from './get-product-use-case'
import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCompany } from 'test/factories/make-company'
import { makeCategory } from 'test/factories/make-category'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository
let useCase: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new GetProductUseCase(
      productsRepository,
      categoriesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(productsRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to retrieve product details', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })

    const category = await makeCategory({
      repository: categoriesRepository
    })

    const product = await makeProduct({
      repository: productsRepository,
      override: {
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
