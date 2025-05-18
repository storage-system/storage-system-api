import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'

export class GetEcommerceBySlugOutput {
  id: string
  createdAt: Date
  productIds: string[]
  name: string
  companyId: string
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

  updatedAt: Date | null

  constructor(data: Ecommerce) {
    this.id = data.id.toString()
    this.createdAt = new Date(data.createdAt)
    this.productIds = data.productIds.map((product) => product.toString())
    this.name = data.name
    this.companyId = data.companyId.toString()
    this.isActive = data.isActive
    this.slug = data.slug.value
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

  static from(rawData: Ecommerce): GetEcommerceBySlugOutput {
    return new GetEcommerceBySlugOutput(rawData)
  }
}
