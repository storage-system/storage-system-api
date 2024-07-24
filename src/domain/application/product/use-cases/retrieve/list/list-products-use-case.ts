import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductsRepository } from '../../../products-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { Category } from '@/domain/enterprise/category/category'
import { ListProductsOutput } from './list-products-output'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { User } from '@/domain/enterprise/user/user'
import { Company } from '@/domain/enterprise/company/company'

interface ListProductsUseCaseRequest {
  page: number
  perPage: number
}

type ListProductsUseCaseResponse = PaginationProps<ListProductsOutput>

@Injectable()
export class ListProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
  ) { }

  async execute(anInput: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
    const products = await this.productsRepository.findAll(anInput)

    const [authors, companies, categories] = await Promise.all([
      this.getUsers(products.items.map((product) => product.authorId.toString())),
      this.getCompanies(products.items.map((product) => product.companyId.toString())),
      Promise.all(products.items.map((product) => this.getCategories(product.categoryIds)))
    ])

    const items = products.items.map((product, index) =>
      ListProductsOutput.from(
        product,
        companies[index],
        categories[index],
        authors[index],
      )
    );

    return new Pagination({
      ...anInput,
      items,
      total: products.total,
    })
  }

  private async getUsers(userIds: string[]): Promise<User[]> {
    const users = await Promise.all(userIds.map((userId) => this.getUser(userId)));

    return users
  }

  private async getUser(id: string) {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw ResourceNotFoundException.with('Usuário', new UniqueEntityID(id));
    }

    return user
  }

  private async getCompanies(companyIds: string[]): Promise<Company[]> {
    const companies = await Promise.all(companyIds.map((companyId) => this.getCompany(companyId)));

    return companies
  }

  private async getCompany(id: string) {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(id));
    }

    return company
  }

  private async getCategories(categoryIds: UniqueEntityID[]): Promise<Category[]> {
    const categories = await Promise.all(categoryIds.map((categoryId) => this.getCategory(categoryId)));

    return categories.filter(category => category !== null);
  }

  private async getCategory(categoryId: UniqueEntityID) {
    const category = await this.categoriesRepository.findById(categoryId.toString())

    if (!category) {
      throw ResourceNotFoundException.with('Categoria', categoryId);
    }

    return category
  }
}
