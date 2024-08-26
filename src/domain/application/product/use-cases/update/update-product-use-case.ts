import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductsRepository } from '../../products-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { DimensionsProduct, StatusProduct } from '@/domain/enterprise/product/product'

export interface UpdateProductUseCaseRequest {
  productId: string
  name?: string
  description?: string
  originalPrice?: number
  finalPrice?: number
  discountPercentage?: number
  quantityInStock?: number
  manufactureDate?: Date
  validityInDays?: number
  unitOfMeasure?: string
  weight?: number
  dimensions?: DimensionsProduct
  manufacturer?: string
  batch?: string
  status?: StatusProduct
  productImage?: string
  categoryIds?: string[]
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) { }

  async execute(props: UpdateProductUseCaseRequest) {
    const product = await this.productsRepository.findById(props.productId)

    if (!product) {
      throw ResourceNotFoundException.with('Produto', new UniqueEntityID(props.productId));
    }

    product.update({
      ...props,
      categoryIds: props.categoryIds?.map((categoryId) => new UniqueEntityID(categoryId))
    })

    await this.productsRepository.update(product)
  }
}
