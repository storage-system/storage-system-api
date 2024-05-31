import { CategoriesRepository } from '../../category/categories-repository'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { SubcategoriesRepository } from '../subcategories-repository'

interface UpdateSubcategoryUseCaseRequest {
  name: string
  subcategoryId: string
  categoryId: string
  isActive: boolean
}

@Injectable()
export class UpdateSubcategoryUseCase {
  constructor(
    private subcategoriesRepository: SubcategoriesRepository,
    private categoriesRepository: CategoriesRepository
  ) { }

  async execute({
    name,
    isActive,
    subcategoryId,
    categoryId,
  }: UpdateSubcategoryUseCaseRequest) {
    const subcategory = await this.subcategoriesRepository.findById(subcategoryId)

    if (!subcategory) {
      throw ResourceNotFoundException.with('Subcategoria', new UniqueEntityID(subcategoryId));
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw ResourceNotFoundException.with('Categoria', new UniqueEntityID(categoryId));
    }

    subcategory.update({
      name,
      categoryId: new UniqueEntityID(categoryId),
      isActive,
    })

    await this.subcategoriesRepository.save(subcategory)
  }
}
