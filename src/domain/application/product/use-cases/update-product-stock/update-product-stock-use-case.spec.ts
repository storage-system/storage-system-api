import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { StockOperation } from '@/domain/enterprise/stock-movement/stock-operation'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { faker } from '@faker-js/faker'

import {
  UpdateProductStockUseCase,
  UpdateProductStockUseCaseRequest,
} from './update-product-stock-use-case'
import { ProductsRepository } from '../../../../enterprise/product/products-repository'

let productsRepository: ProductsRepository
let usersRepository: UsersRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository
let useCase: UpdateProductStockUseCase

describe('Update Product Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    usersRepository = new InMemoryUsersRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    useCase = new UpdateProductStockUseCase(productsRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(productsRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to update product stock', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })

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
    const initialProductStock = product.quantityInStock

    const updateProductStockProps: UpdateProductStockUseCaseRequest = {
      productId,
      operation: StockOperation.INCREASE,
      quantity: 20,
      authorId: faker.person.fullName(),
    }

    await useCase.execute(updateProductStockProps)

    const productOnDatabase = await productsRepository.findById(productId)

    expect(productOnDatabase?.id.toString()).toBe(productId)
    expect(productOnDatabase?.quantityInStock).toBe(
      initialProductStock + updateProductStockProps.quantity,
    )
  })

  it('should not be able to update a product that does not exist', async () => {
    const fakeProductId = 'product-id-non-exist'

    const response = useCase.execute({
      productId: fakeProductId,
      operation: StockOperation.INCREASE,
      quantity: 10,
      authorId: faker.person.fullName(),
    })

    expect(response).rejects.toThrow(
      `Produto com ID ${fakeProductId} não foi encontrado`,
    )
  })
})
