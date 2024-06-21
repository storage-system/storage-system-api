import { Either, right } from '@/core/either'
import { CategoriesRepository } from '../../categories-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import NotAuthorizedException from '@/core/exception/not-authorized-exception'
import { Notification } from '@/core/validation/notification'
import { CompaniesRepository } from '@/domain/application/company/companies-repository'

interface EditCategoryUseCaseRequest {
  name?: string
  isActive?: boolean
  categoryId: string
  companyId: string | undefined
}

type EditCategoryUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class EditCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private companiesRepository: CompaniesRepository,
  ) { }

  async execute({
    name,
    isActive,
    categoryId,
    companyId,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const notification = Notification.create()

    const company = companyId && await this.companiesRepository.findById(companyId)

    if (!company) {
      throw ResourceNotFoundException.with('Empresa', new UniqueEntityID(companyId));
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw ResourceNotFoundException.with('Categoria', new UniqueEntityID(categoryId));
    }

    if (companyId !== category.companyId.toString()) {
      throw new NotAuthorizedException('Unauthorized', notification);
    }

    category.update({
      name,
      isActive,
    })

    await this.categoriesRepository.save(category)

    return right({})
  }
}
