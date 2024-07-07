import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository"
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository"
import { CreateProductUseCase, CreateProductUseCaseRequest } from "./create-product-use-case"
import { makeUser } from "test/factories/make-user"
import { makeCompany } from "test/factories/make-company"
import { makeCategory } from "test/factories/make-category"
import { StatusProduct } from "@/domain/enterprise/product/product"
import { faker } from "@faker-js/faker"
import { UsersRepository } from "@/domain/application/user/users-repository"
import { ProductsRepository } from "../../products-repository"
import { CompaniesRepository } from "@/domain/application/company/companies-repository"
import { CategoriesRepository } from "@/domain/application/category/categories-repository"

let productsRepository: ProductsRepository
let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let categoriesRepository: CategoriesRepository

let useCase: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    useCase = new CreateProductUseCase(
      productsRepository,
      companiesRepository,
      usersRepository,
      categoriesRepository,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()

    expect(productsRepository).toBeDefined()
    expect(companiesRepository).toBeDefined()
    expect(usersRepository).toBeDefined()
    expect(categoriesRepository).toBeDefined()
  })

  it('should be able to create a new product', async () => {
    const user = await makeUser({
      repository: usersRepository,
    })
    const company = await makeCompany({
      override: {
        users: [user.id.toString()]
      },
      repository: companiesRepository,
    })
    const category = await makeCategory({
      repository: categoriesRepository,
    })

    const productMock: CreateProductUseCaseRequest = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      companyId: company.id.toString(),
      categoryIds: [category.id.toString()],
      authorId: company.users[0],
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
        min: 0
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
    const user = await makeUser({
      repository: usersRepository,
    })
    const category = await makeCategory({
      repository: categoriesRepository,
    })

    const companyNonExists = 'company-id'

    const productMock: CreateProductUseCaseRequest = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      companyId: companyNonExists,
      categoryIds: [category.id.toString()],
      authorId: user.id.toString(),
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
        min: 0
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

    expect(useCase.execute(productMock)).rejects.toThrowError()
  })

  it('should not be able to create a product that user does not exist', async () => {
    const company = await makeCompany({
      repository: companiesRepository,
    })
    const category = await makeCategory({
      repository: categoriesRepository,
    })

    const userNonExists = 'user-id'

    const productMock: CreateProductUseCaseRequest = {
      name: faker.company.name(),
      description: faker.commerce.productDescription(),
      companyId: company.id.toString(),
      categoryIds: [category.id.toString()],
      authorId: userNonExists,
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
        min: 0
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

    expect(useCase.execute(productMock)).rejects.toThrowError()
  })
})
