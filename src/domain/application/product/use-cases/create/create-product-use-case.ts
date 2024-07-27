import { Injectable } from '@nestjs/common'
import { Notification } from '@/core/validation/notification'
import NotificationException from '@/core/exception/notification-exception'
import { Product, StatusProduct } from '@/domain/enterprise/product/product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'
import { CategoriesRepository } from '@/domain/application/category/categories-repository'
import { ProductsRepository } from '../../products-repository'
import { UsersRepository } from '@/domain/application/user/users-repository'
import Error from '@/core/validation/error'
import { ValidationHandler } from '@/core/validation/validation-handler'

export interface CreateProductUseCaseRequest {
  name: string
  description: string
  originalPrice: number
  finalPrice: number
  discountPercentage: number
  quantityInStock: number
  manufactureDate?: Date
  validityInDays: number
  unitOfMeasure: string
  weight: number
  dimensions_height: string
  dimensions_width: string
  dimensions_depth: string
  manufacturer?: string
  batch?: string
  status: StatusProduct
  productImage?: string
  companyId: string
  categoryIds: string[]
}

export interface CreateProductUseCaseResponse {
  productId: string
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
  ) { }

  async execute(anInput: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const notification = Notification.create()

    const company = await this.companiesRepository.findById(anInput.companyId)

    if (!company) {
      throw notification.appendAnError(new Error("Empresa não encontrada"))
    }

    const categoriesValidation = await Promise.all(
      anInput.categoryIds.map((categoryId) => this.validateCategory(categoryId, notification))
    )

    const categories = categoriesValidation
      .filter(category => category)
      .map(category => category?.id)
      .filter(id => id !== undefined) as UniqueEntityID[];

    const product = Product.create({
      ...anInput,
      categoryIds: categories,
      dimensions: {
        depth: anInput.dimensions_depth,
        height: anInput.dimensions_height,
        width: anInput.dimensions_width,
      },
      companyId: new UniqueEntityID(anInput.companyId),
    })

    if (notification.hasErrors()) {
      throw new NotificationException('Erro ao criar o produto', notification)
    }

    await this.productsRepository.create(product)

    return {
      productId: product.id.toString()
    }
  }

  async validateCategory(id: string, aHandler: ValidationHandler) {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      aHandler.appendAnError(
        new Error("Categoria não encontrada.")
      )
    }

    return category
  }
}