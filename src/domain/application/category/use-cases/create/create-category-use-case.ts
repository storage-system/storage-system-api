import { Category } from '@/domain/enterprise/category/category'
import { CategoriesRepository } from '../../categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CategoryAlreadyExistsError } from '@/core/errors/category-already-exists-error'
import { Slug } from '@/domain/enterprise/slug/slug'
import NotificationException from '@/core/exception/notification-exception'
import { Notification } from '@/core/validation/notification'

interface CreateCategoryUseCaseRequest {
  name: string
  companyId: string
  isActive: boolean
}

type CreateCategoryUseCaseResponse = Either<CategoryAlreadyExistsError, { category: Category }>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    companyId,
    isActive,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
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

    return right({
      category,
    })
  }
}
