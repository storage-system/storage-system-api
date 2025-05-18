import { CompaniesRepository } from '@/domain/enterprise/company/companies-repository'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import NotificationException from '@/core/exception/notification-exception'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/category/category'
import { Notification } from '@/core/validation/notification'
import { FileID } from '@/domain/enterprise/file/file'
import { Slug } from '@/domain/enterprise/slug/slug'
import { User } from '@/domain/enterprise/user/user'
import { Injectable } from '@nestjs/common'

import { CategoriesRepository } from '../../../../enterprise/category/categories-repository'

interface CreateCategoryUseCaseRequest {
  name: string
  fileId?: string
  author: User
  isActive: boolean
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute(anInput: CreateCategoryUseCaseRequest) {
    const notification = Notification.create()
    const { author, isActive, name, fileId } = anInput

    const companyId = author.companyId?.toString()

    const company =
      companyId && (await this.companiesRepository.findById(companyId))

    if (!company) {
      throw ResourceNotFoundException.with(
        'Empresa',
        new UniqueEntityID(companyId),
      )
    }

    const existingCategory = await this.categoriesRepository.findBySlug(
      Slug.convertToSlug(name),
    )

    if (existingCategory) {
      throw new NotificationException(
        `Category "${name}" already exists.`,
        notification,
      )
    }

    const category = Category.create({
      name,
      isActive,
      icon: fileId ? new FileID(fileId) : undefined,
      companyId: new UniqueEntityID(companyId),
    })

    await this.categoriesRepository.save(category)

    return {
      categoryId: category.id.toString(),
    }
  }
}
