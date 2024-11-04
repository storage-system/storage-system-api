import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { StatusProduct } from '@/domain/enterprise/product/product'
import { makeCategory } from 'test/factories/make-category'
import { makeCompany } from 'test/factories/make-company'
import { faker } from '@faker-js/faker'

import {
  CreateProductUseCase,
  CreateProductUseCaseRequest,
} from './create-product-use-case'
import { ProductsRepository } from '../../../../enterprise/product/products-repository'

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let categoriesRepository: CategoriesRepository

let useCase: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new CreateProductUseCase(
      productsRepository,
      companiesRepository,
      categoriesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(productsRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(categoriesRepository).toBeDefined()
  })

  it('should be able to create a new product', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })
    const category = await makeCategory({
      repository: categoriesRepository,
    })

    const productMock: CreateProductUseCaseRequest = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      fileIds: [],
      companyId: company.id.toString(),
      categoryIds: [category.id.toString()],
      depth: '5cm',
      height: '10cm',
      width: '20cm',
      originalPrice: faker.number.int({
        max: 200,
        min: 100,
      }),
      discountPercentage: faker.number.int({
        max: 90,
        min: 1,
      }),
      finalPrice: faker.number.int({
        max: 150,
        min: 50,
      }),
      quantityInStock: faker.number.int({
        max: 100,
        min: 0,
      }),
      validityInDays: faker.number.int({
        min: 1,
        max: 100,
      }),
      weight: faker.number.int(),
      status: StatusProduct.ACTIVE,
      unitOfMeasure: 'kg',
      manufactureDate: faker.date.past(),
    }

    await useCase.execute(productMock)

    const productOnDatabase = await productsRepository.findAll({
      page: 1,
      perPage: 10,
    })

    expect(productOnDatabase.items).toBeDefined()
    expect(productOnDatabase.items[0].name).toBe(productMock?.name)
  })

  it('should not be able to create a product that company does not exist', async () => {
    const category = await makeCategory({
      repository: categoriesRepository,
    })

    const companyNonExists = 'company-id'

    const productMock: CreateProductUseCaseRequest = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      fileIds: [],
      depth: '5cm',
      height: '10cm',
      width: '20cm',
      companyId: companyNonExists,
      categoryIds: [category.id.toString()],

      originalPrice: faker.number.int({
        max: 200,
        min: 100,
      }),
      discountPercentage: faker.number.int({
        max: 90,
        min: 1,
      }),
      finalPrice: faker.number.int({
        max: 150,
        min: 50,
      }),
      quantityInStock: faker.number.int({
        max: 100,
        min: 0,
      }),
      validityInDays: faker.number.int({
        min: 1,
        max: 100,
      }),
      weight: faker.number.int(),
      status: StatusProduct.ACTIVE,
      unitOfMeasure: 'kg',
      manufactureDate: faker.date.past(),
    }

    expect(useCase.execute(productMock)).rejects.toThrowError(
      `Empresa com ID ${productMock.companyId} não foi encontrado`,
    )
  })
})
