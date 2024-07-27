import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductsRepository } from '../../../products-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { GetProductOutput } from './get-product-output'
import { Category } from '@/domain/enterprise/category/category'

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = GetProductOutput

@Injectable()
export class GetProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private companiesRepository: CompaniesRepository,
    private categoriesRepository: CategoriesRepository,
  ) { }

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw ResourceNotFoundException.with('Produto', new UniqueEntityID(productId));
    }

    const [company, categories] = await Promise.all([
      this.getCompany(product.companyId.toString()),
      this.getCategories(product.categoryIds.map((categoryId) => categoryId.toString()))
    ]);

    return GetProductOutput.fromAggregate(
      product,
      company,
      categories,
    )
  }

  private async getCompany(id: string) {
    const company = await this.companiesRepository.findById(id)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(id));
    }

    return company
  }

  private async getCategories(categoryIds: string[]): Promise<Category[]> {
    const categories = await Promise.all(categoryIds.map((categoryId) => this.getCategory(categoryId)));

    return categories.filter(category => category !== null);
  }

  private async getCategory(categoryId: string) {
    const category = await this.categoriesRepository.findById(categoryId)
    if (!category) {
      throw ResourceNotFoundException.with('Categoria', new UniqueEntityID(categoryId));
    }
    return category
  }
}
