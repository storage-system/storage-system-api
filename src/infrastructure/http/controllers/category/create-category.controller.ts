import { CurrentCompany } from '@/infrastructure/auth/current-company-decorator'
import { CompanyPayload } from '@/infrastructure/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infrastructure/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, ConflictException, Controller, NotFoundException, Post } from '@nestjs/common'
import { CreateCategoryUseCase } from '@/domain/application/category/use-cases/create-category'
import { z } from 'zod'
import { CategoryAlreadyExistsError } from '@/core/errors/category-already-exists-error'

const createCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

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