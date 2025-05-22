import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { FileID } from '@/domain/enterprise/file/file'

import { GetEcommerceByCompanyIdOutput } from './get-ecommerce-by-company-id-output'

interface GetEcommerceByCompanyIdUseCaseRequest {
  companyId: string
}

@Injectable()
export class GetEcommerceByCompanyIdUseCase {
  constructor(
    private readonly ecommerceRepository: EcommerceRepository,
    private readonly filesRepository: FileRepository,
    private fileStorageRepository: FileStorageGateway,
  ) {}

  async execute(props: GetEcommerceByCompanyIdUseCaseRequest) {
    const ecommerce = await this.ecommerceRepository.findByCompanyId(
      props.companyId,
    )

    if (!ecommerce) {
      throw new NotFoundException('Ecommerce not found')
    }

    const previewUrl =
      ecommerce.ecommercePreview &&
      (await this.getPreviewImageUrl(ecommerce.ecommercePreview))

    return GetEcommerceByCompanyIdOutput.from({
      id: ecommerce.id,
      name: ecommerce.name,
      slug: ecommerce.slug,
      isActive: ecommerce.isActive,
      previewUrl,
      companyId: ecommerce.companyId,
      styles: ecommerce.styles,
      hero: ecommerce.hero,
      productIds: ecommerce.productIds,
      createdAt: ecommerce.createdAt,
      updatedAt: ecommerce.updatedAt,
      deletedAt: ecommerce.deletedAt,
    })
  }

  async getPreviewImageUrl(previewImageId: FileID) {
    const previewImage = await this.filesRepository.findById(
      previewImageId.toString(),
    )

    if (!previewImage) {
      throw new NotFoundException('Preview image not found')
    }

    const fileUrl = await this.fileStorageRepository.getFileUrl(
      previewImage.path,
    )

    return fileUrl
  }
}
