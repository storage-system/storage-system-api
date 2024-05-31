import { SubcategoriesRepository } from '../subcategories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Slug } from '@/domain/enterprise/slug/slug'
import NotificationException from '@/core/exception/notification-exception'
import { Notification } from '@/core/validation/notification'
import { CategoriesRepository } from '../../category/categories-repository'
import { Subcategory } from '@/domain/enterprise/subcategory/subcategory'

interface CreateSubcategoryUseCaseRequest {
  name: string
  categoryId: string
  isActive: boolean
}

@Injectable()
export class CreateSubcategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private subcategoriesRepository: SubcategoriesRepository,
  ) { }

  async execute({
    name,
    categoryId,
    isActive,
  }: CreateSubcategoryUseCaseRequest) {
    const notification = Notification.create()

    const existingSubcategory = await this.subcategoriesRepository.findBySlug(Slug.convertToSlug(name));

    if (existingSubcategory) {
      throw new NotificationException(`A subcategoria ${name} já existe.`, notification)
    }

    const existingCategory = await this.categoriesRepository.findById(categoryId)

    if (!existingCategory) {
      throw new NotificationException(`Categoria não encontrada.`, notification)
    }

    const subcategory = Subcategory.create({
      name,
      isActive,
      categoryId: new UniqueEntityID(categoryId),
    })

    await this.subcategoriesRepository.create(subcategory)
  }
}
