import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/category/category'
import { Injectable } from '@nestjs/common'

import { ProductsRepository } from '../../../../../enterprise/product/products-repository'
import { AttachmentProps, GetProductOutput } from './get-product-output'

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = GetProductOutput

@Injectable()
export class GetProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private fileRepository: FileRepository,
    private fileStorageGateway: FileStorageGateway,
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

    if (!product.fileIds.length) {
      return GetProductOutput.fromAggregate(product, categories)
    }

    const attachments = await this.getAttachments(product.fileIds)

    return GetProductOutput.fromAggregate(product, categories, attachments)
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

  private async getAttachments(fileIds: string[]) {
    const files = await Promise.all(
      fileIds.map((id) => this.fileRepository.findById(id)),
    )

    const nonDeleteFiles = files.filter((file) => file && !file.deletedAt)

    const urls = await Promise.all(
      nonDeleteFiles.map(
        (image) => image && this.fileStorageGateway.getFileUrl(image.path),
      ),
    )

    const attachments = nonDeleteFiles
      .map((file, index) => ({
        id: file?.id.toString(),
        filename: file?.filename,
        type: file?.type,
        url: urls[index] || '',
      }))
      .filter((attachment): attachment is AttachmentProps => !!attachment)

    return attachments
  }
}
