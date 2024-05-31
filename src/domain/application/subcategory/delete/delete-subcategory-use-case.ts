import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { SubcategoriesRepository } from '../subcategories-repository'

interface DeleteSubcategoryUseCaseRequest {
  subcategoryId: string
}

@Injectable()
export class DeleteSubcategoryUseCase {
  constructor(private subcategoriesRepository: SubcategoriesRepository) { }

  async execute({
    subcategoryId,
  }: DeleteSubcategoryUseCaseRequest) {
    const subcategory = await this.subcategoriesRepository.findById(subcategoryId)

    if (!subcategory) {
      throw ResourceNotFoundException.with('Subcategoria', new UniqueEntityID(subcategoryId));
    }

    await this.subcategoriesRepository.delete(subcategory)
  }
}
