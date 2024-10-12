import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/category/category'
import { Injectable } from '@nestjs/common'

import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { GetProductOutput } from './get-product-output'

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = GetProductOutput

@Injectable()
export class GetProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw ResourceNotFoundException.with(
        'Produto',
        new UniqueEntityID(productId),
      )
    }

    const categories = await this.getCategories(
      product.categoryIds.map((categoryId) => categoryId.toString()),
    )

    return GetProductOutput.fromAggregate(product, categories)
  }

  private async getCategories(categoryIds: string[]): Promise<Category[]> {
    const categories = await Promise.all(
      categoryIds.map((categoryId) => this.getCategory(categoryId)),
    )

    return categories.filter((category) => category !== null)
  }

  private async getCategory(categoryId: string) {
    const category = await this.categoriesRepository.findById(categoryId)
    if (!category) {
      throw ResourceNotFoundException.with(
        'Categoria',
        new UniqueEntityID(categoryId),
      )
    }
    return category
  }
}
