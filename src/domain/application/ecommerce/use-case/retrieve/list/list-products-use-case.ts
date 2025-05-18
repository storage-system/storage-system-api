import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/category/category'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Slug } from '@/domain/enterprise/slug/slug'

import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { ListEcommerceProductsCommand } from './list-ecommerce-products-command'
import { ListEcommerceProductsOutput } from './list-ecommerce-products-output'

type ListEcommerceProductsUseCaseResponse =
  PaginationProps<ListEcommerceProductsOutput>

@Injectable()
export class ListEcommerceProductsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private ecommerceRepository: EcommerceRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    anInput: ListEcommerceProductsCommand,
  ): Promise<ListEcommerceProductsUseCaseResponse> {
    const ecommerce = await this.findEcommerceBySlug(anInput.ecommerceSlug)

    const products = await this.productsRepository.findAllByEcommerceId({
      ecommerceId: ecommerce.id.toString(),
      categoryId: anInput.categoryId,
      page: anInput.page,
      perPage: anInput.perPage,
    })

    const categories = await Promise.all(
      products.items.map((product) => this.getCategories(product.categoryIds)),
    )

    const items = products.items.map((product, index) =>
      ListEcommerceProductsOutput.from(product, categories[index]),
    )

    return new Pagination<ListEcommerceProductsOutput>({
      page: products.page,
      perPage: products.perPage,
      items,
      total: products.total,
    })
  }

  private async findEcommerceBySlug(slug: string) {
    const ecommerce = await this.ecommerceRepository.findBySlug(
      Slug.create(slug),
    )

    if (!ecommerce) {
      throw new NotFoundException('Ecommerce not found')
    }

    return ecommerce
  }

  private async getCategories(
    categoryIds: UniqueEntityID[],
  ): Promise<Category[]> {
    const categories = await Promise.all(
      categoryIds.map((categoryId) => this.getCategory(categoryId)),
    )

    return categories.filter((category) => category !== null)
  }

  private async getCategory(categoryId: UniqueEntityID) {
    const category = await this.categoriesRepository.findById(
      categoryId.toString(),
    )

    if (!category) {
      throw ResourceNotFoundException.with('Categoria', categoryId)
    }

    return category
  }
}
