import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'
import { makeCompany } from 'test/factories/make-company'

import { ProductsRepository } from '../../../../enterprise/product/products-repository'
import { DeleteProductUseCase } from './delete-product-use-case'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository
let useCase: DeleteProductUseCase

describe('Delete Product Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()

    useCase = new DeleteProductUseCase(productsRepository)
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

    const productId = product.id.toString()

    await useCase.execute({
      productId,
    })

    const productOnDatabase = await productsRepository.findById(productId)

    expect(productOnDatabase).toBeNull()
  })

  it('should not be able to delete a product that does not exist', async () => {
    const fakeProductId = 'product-id-non-exist'

    const response = useCase.execute({
      productId: fakeProductId,
    })

    expect(response).rejects.toThrow(
      `Produto com ID ${fakeProductId} não foi encontrado`,
    )
  })
})
