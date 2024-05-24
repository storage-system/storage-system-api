import { Category } from '@/domain/enterprise/category/category'
import { CategoriesRepository } from '../../categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Slug } from '@/domain/enterprise/slug/slug'
import NotificationException from '@/core/exception/notification-exception'
import { Notification } from '@/core/validation/notification'

interface CreateCategoryUseCaseRequest {
  name: string
  companyId: string
  isActive: boolean
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    companyId,
    isActive,
  }: CreateCategoryUseCaseRequest) {
    const notification = Notification.create()

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
  }
}
