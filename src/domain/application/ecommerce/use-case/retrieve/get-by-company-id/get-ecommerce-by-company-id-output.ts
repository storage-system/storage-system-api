import { EcommerceID } from '@/domain/enterprise/ecommerce/ecommerce'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductID } from '@/domain/enterprise/product/product'
import { Hero } from '@/domain/enterprise/ecommerce/hero'
import { Style } from '@/domain/enterprise/style/style'
import { FileID } from '@/domain/enterprise/file/file'
import { Slug } from '@/domain/enterprise/slug/slug'

interface GetEcommerceByCompanyIdOutputProps {
  id: EcommerceID
  name: string
  slug: Slug
  isActive: boolean
  previewUrl?: string
  companyId: UniqueEntityID
  styles: Style[]
  hero: { text: string; fileId: FileID; fileUrl: string }[]
  productIds: ProductID[]
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class GetEcommerceByCompanyIdOutput {
  id: string
  createdAt: Date
  productIds: string[]
  name: string
  companyId: string
  previewUrl?: string
  isActive: boolean
  slug: string
  styles: {
    id: string
    createdAt: Date
    name: string
    isActive: boolean
    backgroundColor: string
    textColor: string
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
  }[]

  hero: {
    fileId: string
    text: string
    fileUrl: string
  }[]

  updatedAt: Date | null

  constructor(data: GetEcommerceByCompanyIdOutputProps) {
    this.id = data.id.toString()
    this.createdAt = new Date(data.createdAt)
    this.productIds = data.productIds.map((product) => product.toString())
    this.name = data.name
    this.companyId = data.companyId.toString()
    this.isActive = data.isActive
    this.previewUrl = data.previewUrl
    this.slug = data.slug.value
    this.hero = data.hero.map((hero) => ({
      fileId: hero.fileId.toString(),
      text: hero.text,
      fileUrl: hero.fileUrl,
    }))
    this.styles = data.styles.map((style) => ({
      id: style.id.toString(),
      createdAt: new Date(style.createdAt),
      name: style.name,
      isActive: style.isActive,
      backgroundColor: style.backgroundColor,
      textColor: style.textColor,
      primaryColor: style.primaryColor,
      secondaryColor: style.secondaryColor,
      tertiaryColor: style.tertiaryColor,
    }))
    this.updatedAt = data.updatedAt ?? null
  }

  static from(
    rawData: GetEcommerceByCompanyIdOutputProps,
  ): GetEcommerceByCompanyIdOutput {
    return new GetEcommerceByCompanyIdOutput(rawData)
  }
}
