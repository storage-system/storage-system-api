import { ProductsRepository } from '../../products-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { makeUser } from 'test/factories/make-user'
import { makeCompany } from 'test/factories/make-company'
import { makeCategory } from 'test/factories/make-category'
import { DeleteProductUseCase } from './delete-product-use-case'
import { UsersRepository } from '@/domain/application/user/users-repository'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'

let productsRepository: ProductsRepository
let usersRepository: UsersRepository
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
        companyId: company.id,
        categoryIds: [category.id]
      }
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

    expect(response).rejects.toThrow(`Produto com ID ${fakeProductId} não foi encontrado`)
  })
})
