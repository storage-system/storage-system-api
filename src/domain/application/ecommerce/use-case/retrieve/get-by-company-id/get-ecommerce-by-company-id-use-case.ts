import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { FileStorageGateway } from '@/domain/enterprise/file/file-storage.gateway'
import { FileRepository } from '@/domain/enterprise/file/file-repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Hero } from '@/domain/enterprise/ecommerce/hero'
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

    const heroImages = await this.getHeroImageUrl(ecommerce.hero)

    return GetEcommerceByCompanyIdOutput.from({
      id: ecommerce.id,
      name: ecommerce.name,
      slug: ecommerce.slug,
      isActive: ecommerce.isActive,
      previewUrl,
      companyId: ecommerce.companyId,
      styles: ecommerce.styles,
      hero: heroImages,
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

  async getHeroImageUrl(hero: Hero[]) {
    const heroImages = await Promise.all(
      hero.map(async (heroItem) => {
        const heroImage = await this.filesRepository.findById(
          heroItem.fileId.toString(),
        )

        if (!heroImage) {
          throw new NotFoundException('Hero image not found')
        }

        const fileUrl = await this.fileStorageRepository.getFileUrl(
          heroImage.path,
        )

        return {
          fileId: heroItem.fileId,
          text: heroItem.text,
          fileUrl,
        }
      }),
    )

    return heroImages
  }
}
