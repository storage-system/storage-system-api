import { EcommerceRepository } from '@/domain/enterprise/ecommerce/ecommerce-repository'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import { ProductsRepository } from '@/domain/enterprise/product/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import NotificationException from '@/core/exception/notification-exception'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Ecommerce } from '@/domain/enterprise/ecommerce/ecommerce'
import { CompanyID } from '@/domain/enterprise/company/company'
import { ProductID } from '@/domain/enterprise/product/product'
import { Notification } from '@/core/validation/notification'
import { User } from '@/domain/enterprise/user/user'

export type Action = 'add' | 'remove'

export interface UpdateEcommerceProductsUseCaseRequest {
  products: { id: string; action: Action }[]
  author: User
}

@Injectable()
export class UpdateEcommerceProductsUseCase {
  notification: Notification
  logger: Logger = new Logger(UpdateEcommerceProductsUseCase.name)

  constructor(
    private readonly ecommerceRepository: EcommerceRepository,
    private readonly companyRepository: CompaniesRepository,
    private readonly productRepository: ProductsRepository,
  ) {}

  async execute(props: UpdateEcommerceProductsUseCaseRequest) {
    this.notification = Notification.create()
    const productIds = props.products.map((p) => ({
      id: new ProductID(p.id),
      action: p.action,
    }))

    await this.verifyIfProductsAreValid(productIds.map((p) => p.id))

    const ecommerce = await this.findEcommerceByCompanyId(
      props.author.companyId,
    )

    this.updateProducts(ecommerce, productIds)
  }

  private async updateProducts(
    ecommerce: Ecommerce,
    products: { id: ProductID; action: Action }[],
  ) {
    const productsToAdd: ProductID[] = []
    const productsToRemove: ProductID[] = []

    for (const product of products) {
      if (product.action === 'add') {
        ecommerce.addProduct(product.id)
        productsToAdd.push(product.id)
      } else if (product.action === 'remove') {
        ecommerce.removeProduct(product.id)
        productsToRemove.push(product.id)
      }
    }

    if (productsToAdd.length > 0) {
      await this.ecommerceRepository.addProducts(ecommerce.id, productsToAdd)
    }

    if (productsToRemove.length > 0) {
      await this.ecommerceRepository.removeProducts(
        ecommerce.id,
        productsToRemove,
      )
    }

    if (productsToRemove.length > 0 && productsToAdd.length > 0) {
      await this.ecommerceRepository.update(ecommerce)
    }
  }

  private async findEcommerceByCompanyId(companyId?: CompanyID) {
    if (!companyId) {
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada.`)
    }
    const ecommerce = await this.ecommerceRepository.findByCompanyId(
      companyId.toString(),
    )

    if (!ecommerce) {
      throw new NotFoundException(
        `Não foi encontrado um ecommerce para a empresa com ID ${companyId}.`,
      )
    }

    return ecommerce
  }

  private async verifyIfProductsAreValid(productIds: ProductID[]) {
    for (const productId of productIds) {
      const product = await this.productRepository.findById(
        productId.toString(),
      )

      if (!product) {
        this.notification.appendAnError(
          new Error(`Produto com ID ${productId} não encontrado.`),
        )
      }
    }

    if (this.notification.hasErrors()) {
      throw new NotificationException(
        'Erro ao atualizar produtos do ecommerce.',
        this.notification,
      )
    }
  }
}
