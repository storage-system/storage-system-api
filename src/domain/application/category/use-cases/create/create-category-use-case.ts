import { Category } from '@/domain/enterprise/category/category'
import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Slug } from '@/domain/enterprise/slug/slug'
import NotificationException from '@/core/exception/notification-exception'
import { Notification } from '@/core/validation/notification'
import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'

interface CreateCategoryUseCaseRequest {
  name: string
  companyId: string | undefined
  isActive: boolean
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private companiesRepository: CompaniesRepository,
  ) { }

  async execute({
    name,
    companyId,
    isActive,
  }: CreateCategoryUseCaseRequest) {
    const notification = Notification.create()

    const company = companyId && await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    const existingCategory = await this.categoriesRepository.findBySlug(Slug.convertToSlug(name));

    if (existingCategory) {
      throw new NotificationException(`Category "${name}" already exists.`, notification)
    }

    const category = Category.create({
      name,
      isActive,
      companyId: new UniqueEntityID(companyId),
    })

    await this.categoriesRepository.create(category)

    return {
      categoryId: category.id.toString()
    }
  }
}
