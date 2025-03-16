import { CategoriesRepository } from '@/domain/enterprise/category/categories-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { Product, StatusProduct } from '@/domain/enterprise/product/product'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import NotificationException from '@/core/exception/notification-exception'
import { ValidationHandler } from '@/core/validation/validation-handler'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { Injectable } from '@nestjs/common'
import Error from '@/core/validation/error'

import { ProductsRepository } from '../../../../enterprise/product/products-repository'
import { User } from '@/domain/enterprise/user/user'

export interface CreateProductUseCaseRequest {
  name: string
  description: string
  originalPrice: number
  finalPrice: number
  discountPercentage: number
  quantityInStock: number
  minimumStock: number
  manufactureDate: Date
  validityInDays: number
  unitOfMeasure: string
  weight: number
  height: string
  width: string
  depth: string
  manufacturer?: string
  batch?: string
  status: StatusProduct
  productImage?: string
  categoryIds: string[]
  fileIds: string[] | undefined
  author: User
}

export interface CreateProductUseCaseResponse {
  productId: string
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private companiesRepository: CompaniesRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    anInput: CreateProductUseCaseRequest,
  ): Promise<CreateProductUseCaseResponse> {
    const notification = Notification.create()
    
    const company = anInput.author.companyId ? await this.companiesRepository.findById(anInput.author.companyId?.toString()) : null

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(anInput.author.companyId?.toString()),
      )
    }

    const categoriesValidation = await Promise.all(
      anInput.categoryIds.map((categoryId) =>
        this.validateCategory(categoryId, notification),
      ),
    )

    const categories = categoriesValidation
      .filter((category) => category)
      .map((category) => category?.id)
      .filter((id) => id !== undefined) as UniqueEntityID[]

    const product = Product.create({
      ...anInput,
      fileIds: anInput.fileIds ?? [],
      categoryIds: categories,
      manufactureDate: anInput.manufactureDate,
      companyId: new UniqueEntityID(company.id.toString()),
      dimensions: {
        depth: anInput.depth,
        height: anInput.height,
        width: anInput.width,
      },
    })

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar o produto', notification)
    }

    await this.productsRepository.save(product)

    return {
      productId: product.id.toString(),
    }
  }

  async validateCategory(id: string, aHandler: ValidationHandler) {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      aHandler.appendAnError(new Error(`Categoria ${id} não encontrada.`))
    }

    return category
  }
}
