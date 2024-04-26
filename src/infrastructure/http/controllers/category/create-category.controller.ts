import { CurrentCompany } from '@/infrastructure/auth/current-company-decorator'
import { CompanyPayload } from '@/infrastructure/auth/jwt.strategy'
import { BadRequestException, Body, ConflictException, Controller, NotFoundException, Post } from '@nestjs/common'
import { CreateCategoryUseCase } from '@/domain/application/category/use-cases/create-category'
import { CategoryAlreadyExistsError } from '@/core/errors/category-already-exists-error'
import { CreateCategoryBodySchema, bodyValidationPipe } from './dto/create-category.dto'

@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload
  ) {
    const { name, isActive } = body

    const companyId = company.sub

    if (!companyId) {
      throw new NotFoundException('Company not found');
    }

    const result = await this.createCategory.execute({
      name,
      isActive,
      companyId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CategoryAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}