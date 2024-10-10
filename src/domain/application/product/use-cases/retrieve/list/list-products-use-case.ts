import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { Category } from '@/domain/enterprise/category/category'
import { ListProductsOutput } from './list-products-output'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Company } from '@/domain/enterprise/company/company'
import { ListProductsCommand } from './list-products-command'

type ListProductsUseCaseResponse = PaginationProps<ListProductsOutput>

@Injectable()
export class ListProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) { }

  async execute(anInput: ListProductsCommand): Promise<ListProductsUseCaseResponse> {
    const products = await this.productsRepository.findAll(anInput)

    const categories = await Promise.all(products.items.map((product) => this.getCategories(product.categoryIds)))

    const items = products.items.map((product, index) =>
      ListProductsOutput.from(
        product,
        categories[index],
      )
    );

    return new Pagination({
      ...anInput,
      items,
      total: products.total,
    })
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
