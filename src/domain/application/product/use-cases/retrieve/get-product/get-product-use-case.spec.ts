import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryFileStorageGateway } from 'test/repositories/in-memory-file-storage.gateway'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryFileRepository } from 'test/repositories/in-memory-file-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'
import { makeCompany } from 'test/factories/make-company'

import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { GetProductUseCase } from './get-product-use-case'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository
let fileRepository: FileRepository
let fileStorageGateway: FileStorageGateway
let useCase: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    productsRepository = new InMemoryProductsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    fileRepository = new InMemoryFileRepository()
    fileStorageGateway = new InMemoryFileStorageGateway()

    useCase = new GetProductUseCase(
      productsRepository,
      categoriesRepository,
      fileRepository,
      fileStorageGateway,
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
      repository: categoriesRepository,
    })

    const product = await makeProduct({
      repository: productsRepository,
      override: {
        companyId: company.id,
        categoryIds: [category.id],
      },
    })

    const result = await useCase.execute({
      productId: product.id.toString(),
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(product.id.toString())
    expect(result.name).toBe(product.name)
  })
})
