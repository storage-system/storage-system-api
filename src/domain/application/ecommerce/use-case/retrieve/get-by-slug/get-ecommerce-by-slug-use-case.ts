import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Slug } from '@/domain/enterprise/slug/slug'

import { GetEcommerceBySlugOutput } from './get-ecommerce-by-slug-output'

interface GetEcommerceBySlugUseCaseRequest {
  slug: string
}

@Injectable()
export class GetEcommerceBySlugUseCase {
  constructor(private readonly ecommerceRepository: EcommerceRepository) {}

  async execute(props: GetEcommerceBySlugUseCaseRequest) {
    const ecommerce = await this.ecommerceRepository.findBySlug(
      Slug.create(props.slug),
    )

    if (!ecommerce) {
      throw new NotFoundException('Ecommerce not found')
    }

    return GetEcommerceBySlugOutput.from(ecommerce)
  }
}
