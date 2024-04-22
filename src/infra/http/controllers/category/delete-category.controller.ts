import { BadRequestException, Controller, Delete, NotFoundException, Param } from '@nestjs/common'
import { DeleteCategoryUseCase } from '@/domain/application/category/use-cases/delete-category'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@Controller('/categories/:id')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) { }

  @Delete()
  async handle(
    @Param('id') categoryId: string,
  ) {
    const result = await this.deleteCategory.execute({
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}