import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductsRepository } from '../../../../enterprise/product/products-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'

interface DeleteProductUseCaseRequest {
  productId: string
}

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) { }

  async execute({
    productId,
  }: DeleteProductUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw ResourceNotFoundException.with('Produto', new UniqueEntityID(productId));
    }

    await this.productsRepository.delete(productId)
  }
}
